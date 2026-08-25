# API Reference

Normative reference for the Yodaat HTTP API.

* **Base URL** — `https://api.yodaat.org`
* **Method** — `GET` only. `POST` returns `405 Method Not Allowed`.
* **Auth** — none.
* **CORS** — permitted for all origins (`flask_cors.CORS(app)`; the response
  echoes the request `Origin`).
* **Content type** — `application/json`. Pass `?callback=<fn>` to get JSONP
  (`flask_jsonpify`); the body is then `fn({...});`.
* **Encoding** — UTF-8. Hebrew and Arabic are returned unescaped.

## Endpoint summary

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/search/<types>` | Search one or more document types |
| GET | `/search/count` | Batch counts for several named queries |
| GET | `/get/<doc_id>` | Fetch one document |
| GET | `/data/…` | Static pipeline output: schemas, CSVs, chart assets, sitemaps |

`apies` also defines `GET /download/<types>` (CSV/XLS/XLSX export). **It is not
reachable on `api.yodaat.org`** — nginx only proxies `/search/`, `/get/` and
`/data/`, so it returns 404. It is documented in
[§ /download](#get-downloadtypes--not-exposed) for completeness.

---

## `GET /search/<types>`

Search across one or more document types.

`<types>` is a comma-separated list of doc-type names, or the literal `all`:

| `<types>` | Searches |
| --- | --- |
| `publications` | the library |
| `orgs` | organisations |
| `datasets` | charts (Gender Statistics + Gender Index) |
| `publications,orgs` | both, as separate sub-queries |
| `all` | all three |

An unknown name returns `200 {"error": "not a real type <name>"}`.

> **`size` and `offset` are per type.** `all?size=1` returns **three** documents —
> one per type — and `search_counts._current.total_overall` is the *sum* of the
> three per-type totals. Plan pagination per type, not across the merged list.

### Query parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `q` | string | — | Full-text query. See [Text search](#text-search-behaviour). |
| `filter` | JSON | — | Structured filter. Restricts results **without** affecting relevance. See [query-language.md](query-language.md). |
| `lookup` | JSON | — | Same syntax as `filter`, but expressed as a `should` clause: it restricts results **and** contributes to relevance. |
| `context` | string | — | A second free-text query used as a hard restriction ("search within"). Matched with operator `or` over the type's inexact fields; does not affect scoring. |
| `size` | int | `10` | Hits to return **per doc type**. |
| `offset` | int | `0` | Hits to skip **per doc type**. Hard ceiling: `offset + size` must be ≤ 10,000. |
| `order` | string | see below | Sort field. Prefix with `-` for descending (`-year`). Also accepts a raw ES sort object as JSON. |
| `minscore` | int | `0` | Elasticsearch `min_score`; drops hits scoring below it. Integer only. |
| `highlight` | string | — | Comma-separated fields to return with `<em>`-wrapped matches, full field value. Requires `q`. |
| `snippets` | string | — | Comma-separated fields to return as an array of matching fragments. Requires `q`. |
| `match_type` | string | `best_fields` | Overrides the `multi_match` type (`best_fields`, `most_fields`, `cross_fields`, `phrase`, `phrase_prefix`). |
| `match_operator` | string | `and` | Overrides the `multi_match` operator (`and` / `or`). |
| `from_date`, `to_date` | date | — | Range filter on `__date_range_from` / `__date_range_to`. **These fields do not exist in the Yodaat indexes** — supplying both always yields 0 results. Use `year__gte` / `year__lte` in `filter` instead. |
| `extra` | string | — | Hook for `apies` subclasses. Yodaat uses the base `Query` class, so it is ignored. |
| `callback` | string | — | JSONP callback name. |

### Sort order (`order`)

The default depends on whether `q` is present:

| Situation | Effective sort |
| --- | --- |
| `order` given, e.g. `-year` | `{"year": {"order": "desc"}}` |
| `order` given without `-`, e.g. `title_kw` | `{"title_kw": {"order": "asc"}}` |
| no `order`, `q` present | `{"_score": {"order": "desc"}}` — relevance |
| no `order`, no `q` | `{"score": {"order": "desc"}}` — the *document's* `score` field, which is constant `1` in Yodaat, so the order is effectively arbitrary but stable |

Only fields that are `keyword`, numeric or otherwise doc-values-enabled can be
sorted on. In practice the useful ones are `year`, `title_kw`,
`create_timestamp`, `entity_id`, `year_founded`, `num_datasets`.

The UI uses exactly three: `''` (relevance / default), `-year` ("newest first"),
and `title_kw` (alphabetical, used on the browse pages).

> When you sort by an explicit field, `score` in the response is **not** a
> relevance score — `apies` falls back to the first sort value. Sorting
> `order=title_kw` makes `score` the title string.

### Text search behaviour

When `q` is present, `apies` builds a `bool.should` with `minimum_should_match: 1`
containing:

1. a `multi_match` over the type's **inexact** and **natural** fields, with
   `type=best_fields`, `operator=and`, `tie_breaker=0.3`. Natural fields are the
   `.hebrew`-analyzed sub-fields, boosted `^10`;
2. one `terms` clause per **exact** (keyword) field, matched against the set of
   *the whole query string, each single word, and each adjacent word pair*. So a
   query of `אלימות במשפחה` will exactly hit the tag `אלימות במשפחה` as well as
   the tags `אלימות` and `משפחה`.

Because the default operator is `and`, multi-word queries are narrow by default.
Pass `match_operator=or` to broaden. Measured on production:
`q=נשים ועוני` → 203 hits with `and`, 4,923 with `or`.

See [data-model.md](data-model.md#searchable-fields-per-type) for the exact
field lists and boosts per type.

### Highlighting

`highlight` and `snippets` both take comma-separated field names, both require
`q`, and both surface their output *inside* each result's `source`:

* `highlight=title` → `source._highlights.title` — the **entire** field value with
  `<em>…</em>` around matches (`number_of_fragments: 0`).
* `snippets=notes` → `source._snippets.notes` — an **array** of matching fragments.

Verified example (`q=נשים&highlight=title&snippets=notes`):

```json
{
  "_highlights": { "title": "השלכות המלחמה על בריאות <em>נשים</em> בישראל" },
  "_snippets":   { "notes": ["…וביטחונן של <em>נשים</em>.", "…1002 <em>נשים</em>, בגילאי 27-55…"] }
}
```

For array fields, `_highlights.<field>` is an array the same length and order as
the original field, with non-matching entries left plain.

### Response

```json
{
  "search_counts": {
    "_current":     { "total_overall": 4835 },
    "publications": { "total_overall": 4835 }
  },
  "search_results": [
    {
      "type":   "publications",
      "score":  78.10517,
      "source": { "doc_id": "publications/AKXQK376", "title": "…", "...": "…" }
    }
  ]
}
```

| Field | Description |
| --- | --- |
| `search_counts.<type>.total_overall` | Exact total matches for that doc type (`track_total_hits: true`, so it is never capped at 10,000). |
| `search_counts._current.total_overall` | Sum of the per-type totals. |
| `search_results[].type` | The doc type the hit came from. See the [`_type` caveat](gotchas.md#_type-narrowing-mislabels-results). |
| `search_results[].score` | Relevance score, or the first sort value when `order` was given. |
| `search_results[].source` | The full indexed document. Its fields are described in [data-model.md](data-model.md). |
| `search_results[].source._highlights` / `._snippets` | Present only when `highlight` / `snippets` were requested. |

Results from multiple types are interleaved by **rank within their own type**:
all rank-1 hits first, then all rank-2 hits, and so on — not by score.

### Errors

Any exception inside the handler is caught and returned as
**HTTP 200** with a single-key body:

```json
{"error": "not a real type nosuchtype"}
```

Always test for the presence of `error` (or of `search_results`), not for the
status code.

### Examples

```bash
# Free text, Hebrew
curl -sG https://api.yodaat.org/search/publications \
     --data-urlencode 'q=נשים' --data-urlencode 'size=5'

# Facet + range filter, newest first
curl -sG https://api.yodaat.org/search/publications \
     --data-urlencode 'filter={"life_areas":["עוני"],"year__gte":2020}' \
     --data-urlencode 'order=-year' --data-urlencode 'size=20'
#=> 95 hits

# Only the Gender Index charts
curl -sG https://api.yodaat.org/search/datasets \
     --data-urlencode 'filter={"kind":"Gender Index"}'
#=> 180 hits

# Everything, two hits per type, most recently added first
curl -sG https://api.yodaat.org/search/all \
     --data-urlencode 'size=2' --data-urlencode 'order=-create_timestamp'
```

---

## `GET /search/count`

Runs several independent counting queries in one request. Returns **only**
totals — no documents. This is what the Yodaat home page uses to fill in the
"N publications / N organisations / N statistics" figures.

### Query parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `config` | JSON array | **yes** | The list of queries to count. |
| `q` | string | no | A full-text query applied to *every* entry in `config`. |
| `context` | string | no | As in `/search`. |
| `from_date`, `to_date` | date | no | As in `/search` (and equally inert here). |
| `extra` | string | no | Ignored. |
| `callback` | string | no | JSONP callback name. |

Each entry of `config` is an object with three required keys:

| Key | Type | Description |
| --- | --- | --- |
| `id` | string | Your label for this count; becomes the response key. |
| `doc_types` | array of strings | Doc types to count over. `["all"]` is accepted. |
| `filters` | filter expression | Same syntax as the `filter` parameter. Use `[]` for "no filter". |

Omitting `config` returns `{"error": "a Unicode decoding error occurred"}`.

### Response

```json
{ "search_counts": { "publications": { "total_overall": 8463 },
                     "orgs":         { "total_overall": 136  } } }
```

Note the shape difference from `/search/<types>`: keys here are **your `id`s**,
and there is no `_current` entry.

### Example

```bash
curl -sG https://api.yodaat.org/search/count --data-urlencode 'config=[
  {"id":"publications","doc_types":["publications"],"filters":[]},
  {"id":"orgs",        "doc_types":["orgs"],        "filters":[]},
  {"id":"stats",       "doc_types":["datasets"],    "filters":[{"kind":"Gender Statistics"}]},
  {"id":"gender_index","doc_types":["datasets"],    "filters":[{"kind":"Gender Index"}]}
]'
```

Add `q=…` to get the same four counts *restricted to a search term* — the standard
way to render "results per category" tabs without four round trips.

---

## `GET /get/<doc_id>`

Fetch a single document by id. `doc_id` may contain slashes (`publications/AKXQK376`).

| Parameter | Description |
| --- | --- |
| `type` | Optional. Read from that doc type's own index instead of the shared `migdar__docs` index. **This changes the response shape** (see below). |
| `callback` | JSONP callback name. |

Returns **HTTP 404** with Flask's default HTML body when the id is unknown. This
is the only endpoint that uses a real error status.

### Response shape — default (no `type`)

Reads from `migdar__docs`, where each row was collated into an envelope:

```json
{
  "doc_id":   "publications/AKXQK376",
  "revision": 202642,
  "score":    1.0,
  "value":    { "title": "…", "authors": "…", "…": "…" }
}
```

The actual document is under **`value`**, and `value` does **not** contain
`doc_id`, `revision`, `score` or `create_timestamp` — those live on the envelope.
(The UI compensates: `api.service.ts` unwraps `value` and copies `doc_id` back in.)

### Response shape — with `?type=<type>`

Reads from `migdar__<type>` and returns the flat document, exactly as it appears
inside `search_results[].source` — including `doc_id`, `revision`, `score` and
`create_timestamp`, and with no `value` wrapper.

```bash
curl -s 'https://api.yodaat.org/get/publications/AKXQK376'                       # envelope
curl -s 'https://api.yodaat.org/get/publications/AKXQK376?type=publications'     # flat
curl -s 'https://api.yodaat.org/get/org/580416634'
curl -s 'https://api.yodaat.org/get/dataset/4168546c4d8672e3'
```

---

## Data files (`/data/<path>`)

An nginx autoindex over the pipelines' output volume. Browsable — request a
directory to get an HTML listing.

| Path | Contents |
| --- | --- |
| `/data/publications_in_es/datapackage.json` | Frictionless schema for `publications`, including the `es:*` annotations that drive search. |
| `/data/publications_in_es/data/publications.csv` | The full publications table as CSV (~33 MB). |
| `/data/orgs_in_es/data/orgs.csv` | The organisations table as CSV (~2 MB). |
| `/data/datasets_in_es/data/out.csv` | The datasets table as CSV. Note the file is `out.csv`, not `datasets.csv`. |
| `/data/orgs_in_es/datapackage.json`, `/data/datasets_in_es/datapackage.json` | Schemas for the other two types. |
| `/data/dataset/<hash>.png` | Rendered chart image for `dataset/<hash>`. |
| `/data/dataset/<hash>-share.png` | Social-card version of the same chart. |
| `/data/dataset/<hash>.xlsx` | The chart's underlying data as a spreadsheet. |
| `/data/en/dataset/…`, `/data/ar/dataset/…` | English and Arabic renderings of the chart images. |
| `/data/sitemap.xml` | Sitemap index; twelve child sitemaps (3 types + tags × 3 languages). |
| `/data/broken_links/broken_links.xlsx` | Link-rot report produced by the `broken_links` pipeline. |
| `/data/zotero/` | Raw Zotero export used as a publications source. |

Note the language prefix position differs between images and everything else:
`/data/en/dataset/<hash>-share.png` but `/data/dataset/<hash>.xlsx` (the XLSX is
language-neutral).

The `datapackage.json` files are the **authoritative field list** for each type —
they are what the search API itself reads at boot to decide which fields are
searchable.

---

## `GET /download/<types>` — not exposed

Present in `apies`, returns 404 on `api.yodaat.org` because nginx does not proxy
`/download/`. Documented here so nobody re-discovers it from the library source
and assumes it works.

It takes the same search parameters as `/search/<types>` plus `file_format`
(`csv` / `xls` / `xlsx`, default `xlsx`), `file_name`, and `column_mapping`
(a JSON object of `{"Output column": "source.field"}`).

To get bulk data today, use the CSVs under `/data/<type>_in_es/data/` instead.
