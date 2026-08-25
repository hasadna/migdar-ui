# Gotchas

Behaviours that will cost you an afternoon if you don't know them. Everything on
this page was reproduced against the production API in August 2026.

## Errors come back as HTTP 200

Every exception inside the search and count handlers is caught and serialised:

```bash
curl -s https://api.yodaat.org/search/nosuchtype
#=> HTTP 200  {"error": "not a real type nosuchtype"}
```

Check for an `error` key, not for a status code. The single exception is
`/get/<doc_id>` with an unknown id, which does return a real **404** (with an HTML
body, not JSON).

## `size` and `offset` are per doc type

`/search/all?size=1` returns **three** documents, one per type, and
`search_counts._current.total_overall` is the sum of the three per-type totals —
not the length of a merged result set.

Consequences:

* You cannot paginate a merged multi-type list correctly. Page each type
  separately.
* `search_results` is ordered by rank *within each type* — all rank-1 hits, then
  all rank-2 hits — so a low-scoring `orgs` hit can appear above a high-scoring
  `publications` hit.

## Deep pagination silently returns nothing

Elasticsearch's default `max_result_window` is 10,000. Past it, `apies` swallows
the error and you get a perfectly well-formed empty answer:

```bash
curl -sG https://api.yodaat.org/search/publications --data-urlencode 'offset=100000'
#=> {"search_counts": {"_current": {"total_overall": 0}, "publications": {"total_overall": 0}}, "search_results": []}
```

Note the counts also read `0`, so you can't distinguish "past the window" from
"no matches". Keep `offset + size ≤ 10000`; to walk a bigger set, slice it with a
filter (year by year works well) or download the CSV.

## `_type` narrowing mislabels results

Using the `_type` key inside a `filter` restricts which indexes are queried, but
`apies` then zips the *unfiltered* type list against the *filtered* response list:

```bash
curl -sG https://api.yodaat.org/search/all \
     --data-urlencode 'filter=[{"_type":"datasets","kind":"Gender Index"}]'
```

returns genuine dataset documents (`doc_id: "dataset/…"`, `kind: "Gender Index"`)
but reports `"type": "publications"` on every hit and files the count under
`search_counts.publications`.

The bug is in `apies/controllers.py`: `Query.apply_filters()` sets
`filtered_type_names`, `Query.run()` only submits sub-queries for those types, and
`Controllers.search()` then does `zip(query.types, query_results)` over the full
type list.

**Workaround:** name the types you want in the URL path (`/search/datasets`)
rather than via `_type`, and derive the real type from `source.doc_id`'s prefix if
you must use `_type`. It's only safe to use `_type` when the types you name in it
happen to be a prefix of the URL's type list.

## Equality filters fail on multi-word values in analyzed fields

A `term` filter matches individual *analyzed tokens*. For fields that are
Elasticsearch `text` rather than `keyword`, a value containing a space matches
nothing:

```bash
curl -sG https://api.yodaat.org/search/orgs --data-urlencode 'filter={"regions":"כל הארץ"}'
#=> 0     ← but 105 organisations really do carry that value
curl -sG https://api.yodaat.org/search/orgs --data-urlencode 'filter={"regions__like":"כל הארץ"}'
#=> 105
curl -sG https://api.yodaat.org/search/orgs --data-urlencode 'filter={"regions":"צפון"}'
#=> 9     ← single-token values happen to work
```

Affected on `orgs`: `regions`, `specialties`, `provided_services`,
`target_audiences` (`es:keyword: false`). Safe (true keyword fields): `life_areas`,
`tags`, `languages`, `org_kind`, `compact_services`, `item_kind`, `source_kind`,
`kind`, `item_type`, `title_kw`.

Use `__like` whenever you're unsure — it costs relevance nothing, since `filter`
clauses don't score.

## `/get/` returns an envelope, not the document

By default `/get/<doc_id>` reads the shared `migdar__docs` index, whose rows are
`{doc_id, revision, score, value}`. The document is under **`value`**, and `value`
does *not* contain `doc_id`, `revision`, `score` or `create_timestamp`.

Add `?type=<doctype>` to read the per-type index instead and get a flat document
identical to what `search_results[].source` returns.

## `from_date` / `to_date` always return zero

They filter on `__date_range_from` / `__date_range_to`, fields that `apies`
expects some deployments to add. **The Yodaat pipelines never create them**, so
any request supplying both dates matches nothing:

```bash
curl -sG https://api.yodaat.org/search/publications \
     --data-urlencode 'from_date=2020-01-01' --data-urlencode 'to_date=2026-01-01'
#=> total_overall: 0
```

Filter on `year` instead: `filter={"year__gte":2020,"year__lte":2026}`.
(Supplying only one of the two dates is ignored entirely — the range is applied
only when both are present.)

## `/download/` is 404 here

`apies` implements CSV/XLS/XLSX export at `/download/<types>`, but the nginx in
front of `api.yodaat.org` proxies only `/search/`, `/get/` and `/data/`. Use the
CSVs under `/data/<type>_in_es/data/` for bulk data.

## `score` is not always a score

When you pass an explicit `order`, `apies` reports the first *sort value* in the
`score` field of each result. Sorting `order=title_kw` makes `score` the title
string:

```json
{"type": "publications", "score": "\"…והכי חשוב חברים…\"", "source": {…}}
```

Only treat `score` as relevance when you supplied `q` and no `order`.

Separately, the document field `score` (inside `source`) is an editorial boost
multiplier that is currently `1.0` for every document in the corpus — so the
`sqrt(score)` boost `apies` applies is a no-op today.

## The default text operator is `and`

Multi-word queries are conjunctive by default (`multi_match_operator='and'` in
`server.py`). `q=נשים ועוני` gives 203 hits; adding `match_operator=or` gives
4,923. If your users expect "any of these words", set it explicitly.

## Filter on Hebrew, not on the translations

The canonical vocabulary is the unsuffixed (Hebrew) array. `__en` and `__ar` are
lower-cased translations, and `__all` is a deduplicated bag of synonyms across all
languages that can contain artefacts — one publication carries
`languages__all: ["العبرية", "heb", "עברית$obɓ - العبرية", "עברית", "hebrew"]`.
Use `__all` for matching if you must; never render it.

## Some Hebrew values contain typographic characters

`item_kind` includes `דו”ח` — with U+201D RIGHT DOUBLE QUOTATION MARK, not a
straight `"`. Copy vocabulary values from
[data-model.md](data-model.md#controlled-vocabularies) or from live data rather
than retyping them.

## Two datasets have no `kind`

426 datasets = 244 `Gender Statistics` + 180 `Gender Index` + **2 with `kind`
unset**. Those two are invisible on the website, since both of its chart sections
filter on `kind`. If you're computing totals, decide deliberately whether to
include them.

## Structured parameters are parsed leniently

`filter`, `lookup` and `config` go through `demjson3`, so unquoted keys, single
quotes, and even a brace-less `year: 2024` are accepted. Handy when poking at the
API by hand — but don't rely on it from code, and don't be surprised when a
malformed filter silently *works* instead of erroring.

## No aggregations, no facet counts

There is no endpoint that returns "which values exist for `tags`, and how many
documents each". The website's filter lists are a static, hand-maintained
vocabulary compiled into the front-end (`src/app/constants.ts`). To get counts per
value, issue a `/search/count` with one `config` entry per value.

## A `User-Agent` is required

The CDN rejects requests without one. Python's `urllib` gets `403 Forbidden`;
the same request with `User-Agent: Mozilla/5.0` succeeds.

## The API bootstraps over the public internet

`migdar-search-api/server.py` loads its field schemas from
`http://api.yodaat.org/data/{type}_in_es/datapackage.json` at process start —
i.e. the pod calls out through its own public hostname. If `/data/` is
unavailable when the search-api restarts, the service will not come up. Worth
knowing when diagnosing an outage.
