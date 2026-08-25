# Recipes

Task-oriented examples. Every command here was run against production while
writing this document; the counts shown are from August 2026 and will drift.

All examples use `curl -sG … --data-urlencode`, which handles the
percent-encoding of Hebrew and JSON for you. In a browser or from code, encode
the parameter values yourself.

## Contents

* [Basics](#basics)
* [Filtering and faceting](#filtering-and-faceting)
* [Counting](#counting)
* [Working with charts](#working-with-charts)
* [Related items](#related-items)
* [Pagination](#pagination)
* [Bulk data](#bulk-data)
* [How the Yodaat UI uses the API](#how-the-yodaat-ui-uses-the-api)
* [Client snippets](#client-snippets)

---

## Basics

**Search everything for a term**

```bash
curl -sG https://api.yodaat.org/search/all \
     --data-urlencode 'q=אלימות במשפחה' --data-urlencode 'size=5'
```

Returns up to 5 hits *per type* (15 total) and per-type counts.

**Search one type**

```bash
curl -sG https://api.yodaat.org/search/publications --data-urlencode 'q=עוני'
```

**Broaden a multi-word query.** The default operator is `and`, so every word must
appear. Switch to `or` for recall:

```bash
curl -sG https://api.yodaat.org/search/publications \
     --data-urlencode 'q=נשים ועוני' --data-urlencode 'match_operator=or'
# 203 hits with the default `and`; 4,923 with `or`
```

**Fetch one document**

```bash
curl -s https://api.yodaat.org/get/org/580416634          # → {doc_id, revision, score, value}
curl -s 'https://api.yodaat.org/get/org/580416634?type=orgs'   # → the flat document
```

**Get search results with highlighted matches**

```bash
curl -sG https://api.yodaat.org/search/publications \
     --data-urlencode 'q=נשים' \
     --data-urlencode 'highlight=title' \
     --data-urlencode 'snippets=notes'
```

`_highlights.title` holds the whole title with `<em>` markers; `_snippets.notes`
holds an array of matching fragments.

---

## Filtering and faceting

**One facet value**

```bash
curl -sG https://api.yodaat.org/search/publications \
     --data-urlencode 'filter={"life_areas":"עוני"}'
```

**Several values of one facet (OR)**

```bash
curl -sG https://api.yodaat.org/search/publications \
     --data-urlencode 'filter={"life_areas":["עוני","משפחה"]}'
# 1,894 — anything tagged with either
```

**Require *all* values (AND)**

```bash
curl -sG https://api.yodaat.org/search/publications \
     --data-urlencode 'filter={"life_areas__all":["עוני","משפחה"]}'
# 51 — tagged with both
```

**Several different facets (AND across fields)**

```bash
curl -sG https://api.yodaat.org/search/publications --data-urlencode 'filter={
  "languages": "עברית",
  "item_kind": "דו”ח",
  "life_areas": "אלימות מגדרית",
  "year__gte": 2018
}'
```

**Year range**

```bash
curl -sG https://api.yodaat.org/search/publications \
     --data-urlencode 'filter={"year__gte":2015,"year__lte":2020}' \
     --data-urlencode 'order=-year'
```

Use `year`, not `pubyear` — `pubyear` is the raw free-text string as entered.

**Constrain the same field twice** — suffix the second key with `#1`:

```bash
curl -sG https://api.yodaat.org/search/publications --data-urlencode 'filter={
  "year__gte": 2015, "year__lte": 2020,
  "life_areas": "עוני",
  "life_areas#1": ["משפחה","משפט"]
}'
# 38 — poverty AND (family OR law), 2015-2020
```

**Alternative sets of conditions (OR)** — pass an array of clauses:

```bash
curl -sG https://api.yodaat.org/search/publications --data-urlencode 'filter=[
  {"life_areas":"עוני"},
  {"life_areas":"משפחה","year__gte":2020}
]'
```

**Multi-word values on analyzed fields need `__like`.** This trips people up:

```bash
curl -sG https://api.yodaat.org/search/orgs --data-urlencode 'filter={"regions":"כל הארץ"}'
#=> 0   ← wrong, `regions` is analyzed text and "כל הארץ" is two tokens

curl -sG https://api.yodaat.org/search/orgs --data-urlencode 'filter={"regions__like":"כל הארץ"}'
#=> 105 ← correct
```

Affected fields: `regions`, `specialties`, `provided_services`, `target_audiences`
on `orgs`. Everything in
[the vocabulary tables](data-model.md#controlled-vocabularies) other than
`regions` is a proper keyword field and filters exactly.

**Find organisations with / without a field**

```bash
curl -sG https://api.yodaat.org/search/orgs --data-urlencode 'filter={"org_website__exists":true}'      # 113
curl -sG https://api.yodaat.org/search/orgs --data-urlencode 'filter={"hotline_phone_number__empty":true}'  # 110
```

---

## Counting

**Category tabs for a search term** — one request, not four:

```bash
curl -sG https://api.yodaat.org/search/count \
  --data-urlencode 'q=אלימות' \
  --data-urlencode 'config=[
     {"id":"publications", "doc_types":["publications"],"filters":[]},
     {"id":"orgs",         "doc_types":["orgs"],        "filters":[]},
     {"id":"stats",        "doc_types":["datasets"],    "filters":[{"kind":"Gender Statistics"}]},
     {"id":"gender_index", "doc_types":["datasets"],    "filters":[{"kind":"Gender Index"}]}
  ]'
#=> {"search_counts": {"publications": {...838}, "orgs": {...65}, "gender_index": {...12}, ...}}
```

**Grand total across everything**

```bash
curl -sG https://api.yodaat.org/search/count \
  --data-urlencode 'config=[{"id":"everything","doc_types":["all"],"filters":[]}]'
#=> 9,025
```

**A count without documents** — you can also just ask `/search/<types>` for
`size=0`; you get the counts and an empty `search_results`. Use `/search/count`
when you need *several different* counts at once.

---

## Working with charts

**List the Gender Index indicators, in display order**

```bash
curl -sG https://api.yodaat.org/search/datasets \
     --data-urlencode 'filter={"kind":"Gender Index"}' \
     --data-urlencode 'size=200'
```

then sort client-side by `series[0].order_index` — that's exactly what
`gender-index-page-browser.component.ts` does.

**Gender Statistics charts, excluding horizontal bars**

```bash
curl -sG https://api.yodaat.org/search/datasets \
     --data-urlencode 'filter={"kind":"Gender Statistics","chart_type__not":"hbars"}' \
     --data-urlencode 'size=4'
```

**Extract the data points from a chart**

```bash
curl -s 'https://api.yodaat.org/get/dataset/4168546c4d8672e3' \
 | python3 -c '
import json,sys
doc = json.load(sys.stdin)["value"]
print(doc["chart_title"], "—", doc["chart_type"])
for s in doc["series"]:
    print(" ", s["gender"], s["units"])
    for pt in s["dataset"][:5]:
        print("   ", pt["x"], pt["y"], "(estimated)" if pt["q"] else "")
'
```

**Grab the rendered chart or its spreadsheet** — no API call needed:

```bash
HASH=4168546c4d8672e3
curl -O https://api.yodaat.org/data/dataset/$HASH.png          # Hebrew chart image
curl -O https://api.yodaat.org/data/en/dataset/$HASH.png       # English
curl -O https://api.yodaat.org/data/dataset/$HASH-share.png    # social card
curl -O https://api.yodaat.org/data/dataset/$HASH.xlsx         # underlying data
```

---

## Related items

To build a "you might also like" strip, feed the current document's own tags back
in as a `lookup` (so shared tags raise the score) and exclude the document itself
by title:

```bash
curl -sG https://api.yodaat.org/search/all --data-urlencode 'lookup={
  "tags": ["אלימות במשפחה","נשים"],
  "title_kw__not": "השלכות המלחמה על בריאות נשים בישראל"
}' --data-urlencode 'size=4'
```

Using `filter` instead of `lookup` restricts identically but leaves every result
at the same score — fine when you're going to sort by `-year` anyway.

---

## Pagination

`size` and `offset` are **per doc type**. Page one type at a time:

```bash
for OFFSET in 0 20 40; do
  curl -sG https://api.yodaat.org/search/publications \
       --data-urlencode 'filter={"life_areas":"עוני"}' \
       --data-urlencode 'order=-year' \
       --data-urlencode "size=20" --data-urlencode "offset=$OFFSET"
done
```

Two limits to respect:

* `offset + size` must stay ≤ 10,000. Beyond that the API returns
  `total_overall: 0` and an empty list — **no error**. To walk a large set, narrow
  it with a filter (e.g. year by year) rather than deep-paging.
* Always pass an explicit `order` when paginating. Without `q` and without
  `order`, results are sorted by the constant `score` field, which gives no
  guaranteed tie-break between pages.

---

## Bulk data

Don't crawl the search endpoint for a full export. The pipelines already publish
one:

```bash
curl -O https://api.yodaat.org/data/publications_in_es/data/publications.csv   # ~33 MB
curl -O https://api.yodaat.org/data/orgs_in_es/data/orgs.csv                   # ~2 MB
curl -O https://api.yodaat.org/data/datasets_in_es/data/out.csv                # note the name
curl -O https://api.yodaat.org/data/publications_in_es/datapackage.json        # schema
```

Directory listings are browsable, so `https://api.yodaat.org/data/` shows what's
available.

For URL enumeration, the sitemaps are authoritative:
`https://api.yodaat.org/data/sitemap.xml`.

---

## How the Yodaat UI uses the API

Useful as a set of known-good query shapes. Source: `src/app/`.

| UI surface | Request |
| --- | --- |
| Home page counters | `/search/count` with `config` for `publications`, `orgs`, `datasets` |
| Home page "recently added" | `/search/all?size=2&order=-create_timestamp` |
| Home page category cards | `/search/datasets?size=1&filter={"kind":"Gender Index"}` and `…{"kind":"Gender Statistics","chart_type__not":"hbars"}`; `/search/orgs?size=1`; `/search/publications?size=1` |
| Search-box dropdown | `/search/all?q=<term>&size=10`, debounced 300 ms, first 8 shown |
| Search page | `/search/<mapped type>?q=&filter=&order=&size=10`, where `kind=stats` → `datasets` + `{"kind":"Gender Statistics"}` and `kind=gender_index` → `datasets` + `{"kind":"Gender Index"}` |
| Browse pages (`/publications`, `/organisations`, `/stats`) | `/search/<type>?order=title_kw&size=10`, paged |
| Year-slider bounds | two calls: `/search/publications?size=1&order=year` and `…&order=-year` |
| Statistics header carousel | `/search/datasets?size=4&filter={"kind":"Gender Statistics","chart_type__not":"hbars"}` |
| Gender Index browser | `/search/datasets?size=1000`, filtered to `kind == "Gender Index"` client-side, sorted by `series[0].order_index` |
| Item page | `/get/<doc_id>` |
| Related items (publication) | `/search/all?lookup={"tags":…,"title_kw__not":…}` |
| Related items (organisation) | `/search/orgs?filter={"compact_services":…,"tags":…,"title_kw__not":…}` |
| Related items (chart) | `/search/datasets?filter={"life_areas":…,"tags":…,"title_kw__not":…}` |
| SSR Open Graph tags (`index.js`) | `/get/<doc_id>`, reads `value.org_name \|\| value.title \|\| value.chart_title` |

Note the UI applies a default it computes itself: `SearchManager.search()` sets
`order=title_kw` whenever there is no term, no filter and no lookup — that's why
browse pages are alphabetical.

---

## Client snippets

### JavaScript / TypeScript

```ts
const API = 'https://api.yodaat.org';

async function search(types: string, opts: {
  q?: string; size?: number; offset?: number;
  filter?: object; lookup?: object; order?: string;
} = {}) {
  const p = new URLSearchParams();
  if (opts.q)      p.set('q', opts.q);
  if (opts.size)   p.set('size', String(opts.size));
  if (opts.offset) p.set('offset', String(opts.offset));
  if (opts.filter) p.set('filter', JSON.stringify(opts.filter));
  if (opts.lookup) p.set('lookup', JSON.stringify(opts.lookup));
  if (opts.order)  p.set('order', opts.order);

  const res  = await fetch(`${API}/search/${types}?${p}`);
  const body = await res.json();
  if (body.error) throw new Error(body.error);   // errors arrive as HTTP 200

  return {
    total:   body.search_counts?._current?.total_overall ?? 0,
    perType: body.search_counts ?? {},
    results: (body.search_results ?? []).map(
      (r: any) => ({ ...r.source, __type: r.type, __score: r.score })
    ),
  };
}

async function getDocument(docId: string) {
  const res = await fetch(`${API}/get/${docId}`);
  if (res.status === 404) return null;
  const body = await res.json();
  return { ...body.value, doc_id: body.doc_id };  // unwrap the envelope
}
```

(This mirrors `src/app/api.service.ts`, which attaches `__type` to each result
the same way.)

### Python

```python
import json
import requests

API = "https://api.yodaat.org"
SESSION = requests.Session()
SESSION.headers["User-Agent"] = "yodaat-client/1.0"

def search(types, *, q=None, size=10, offset=0, filter=None, lookup=None, order=None):
    params = {"size": size, "offset": offset}
    if q:      params["q"] = q
    if order:  params["order"] = order
    if filter: params["filter"] = json.dumps(filter, ensure_ascii=False)
    if lookup: params["lookup"] = json.dumps(lookup, ensure_ascii=False)

    body = SESSION.get(f"{API}/search/{types}", params=params, timeout=60).json()
    if "error" in body:
        raise RuntimeError(body["error"])
    return body

def iter_all(types, *, page=100, **kw):
    """Walk one doc type. Stops at the 10,000-hit ceiling."""
    offset = 0
    while offset + page <= 10_000:
        body = search(types, size=page, offset=offset, order=kw.pop("order", "-year"), **kw)
        hits = body["search_results"]
        if not hits:
            return
        yield from (h["source"] for h in hits)
        offset += len(hits)
```

> **Set a `User-Agent`.** The CDN in front of the API rejects clients that send
> none: `urllib.request.urlopen("https://api.yodaat.org/search/orgs?size=1")`
> returns `403 Forbidden`, while the identical request with
> `User-Agent: Mozilla/5.0` returns `200`. `curl` and browsers send one by
> default; Python's stdlib and some HTTP libraries effectively don't.
