# Architecture

How a keystroke in the search box becomes an Elasticsearch query and comes back
as a result card.

## The request path

```
                    yodaat.org                          api.yodaat.org
                        │                                     │
              ┌─────────┴─────────┐                 ┌─────────┴──────────┐
              │  nginx (frontend) │                 │  nginx (frontend)  │
              └─────────┬─────────┘                 └──┬───────────┬─────┘
                        │                              │           │
              /         │  /pipelines/          /search/  /get/    │  /data/
              ▼         ▼                              ▼           ▼
       ┌─────────────┐  ┌────────────┐        ┌────────────────┐  ┌────────────┐
       │  web-ui     │  │ pipelines  │        │  search-api    │  │ pipelines  │
       │ (Express +  │  │ (dpp web)  │        │ (Flask/apies,  │  │ (nginx     │
       │  Angular)   │  └────────────┘        │  gunicorn:8000)│  │ autoindex) │
       └──────┬──────┘                        └────────┬───────┘  └─────┬──────┘
              │ SSR meta tags via /get/               │                 │
              └───────────────────────────────────────┤                 │
                                                      ▼                 ▼
                                          ┌──────────────────┐   /pipelines/data
                                          │ Elasticsearch 8  │   (shared volume)
                                          │  + hebrew        │
                                          │    analyzer      │
                                          └────────▲─────────┘
                                                   │ dump_to_es
                                          ┌────────┴─────────┐
                                          │  data pipelines  │
                                          │  (dataflows)     │
                                          └────────▲─────────┘
                                                   │
                                  Google Sheets  ·  Zotero
```

Both hostnames terminate on the same nginx deployment; `server_name` decides
which rule set applies (`migdar-k8s/apps/migdar/nginx/templates/configmap.yaml`).

**`api.yodaat.org` exposes exactly three location blocks:**

```nginx
location /search/  { proxy_pass http://search-api:8000; }
location /get/     { proxy_pass http://search-api:8000; }
location /data/    { proxy_pass http://pipelines; }
```

Anything else on that host 404s. This matters: the `apies` library also registers
a `/download/<types>` endpoint that produces CSV/XLS/XLSX exports, **but it is not
routed on `api.yodaat.org`** and returns 404 in production (verified).

## The layers

### 1. Data pipelines (`migdar-data-pipelines`)

`dataflows`-based jobs, scheduled by `datapackage-pipelines` (see
`pipeline-spec.yaml`), run nightly:

| Pipeline | Schedule | Source | Produces |
| --- | --- | --- | --- |
| `organisations` | `2 2 * * *` | A Google Sheet of organisations | `migdar__orgs` index |
| `datasets` | `2 2 * * *` | Two Google Sheets (Gender Statistics, Gender Index), read *transposed* | `migdar__datasets` index |
| `zotero_fetch` → `publications` | `2 2 * * *` | Zotero library + a multi-tab Google Sheet | `migdar__publications` index |
| `dataset-assets` | after `datasets` | Headless-Chrome screenshots of the site's own card pages | `/data/dataset/*.png`, `*.xlsx` |
| `sitemap` | `10 10 * * *` | The indexes | `/data/sitemap*.xml` |
| `broken_links` | `10 10 * * *` | The indexes | `/data/broken_links/` |

Every row passes through `split_and_translate()`
(`datapackage_pipelines_migdar/flows/i18n.py`), which takes a delimited Hebrew
string, fuzzy-matches each value against a shared translation spreadsheet, and
emits four parallel array fields — `<field>`, `<field>__en`, `<field>__ar` and
`<field>__all` (all languages concatenated). This is why almost every
categorical field in the data model comes in four flavours.

Each pipeline ends in `es_dumper()` (`flows/dump_to_es.py`), which:

1. adds `revision` (a year-week stamp), `score` (constant `1`) and
   `create_timestamp` (preserved across runs for existing `doc_id`s, so
   "recently added" ordering is stable);
2. writes the flat rows to a **per-type index** — `migdar__publications`,
   `migdar__orgs`, `migdar__datasets`;
3. `collate()`s each row into `{doc_id, revision, score, value}` and writes that
   to a **single shared index**, `migdar__docs`;
4. deletes anything in the per-type index whose `revision` is older than this
   run's (so removed source rows disappear);
5. dumps the same data to `/pipelines/data/<type>_in_es/` as a CSV plus a
   Frictionless `datapackage.json`.

That last step is what makes the schemas publicly readable at
`https://api.yodaat.org/data/<type>_in_es/datapackage.json`.

The Elasticsearch image is
`ghcr.io/whiletrue-industries/elasticsearch-analysis-hebrew:8.17.0` — stock ES 8
plus a `hebrew` analyzer, which the mapping attaches as a `.hebrew` sub-field on
titles and Hebrew prose (`BoostingMappingGenerator`).

### 2. The search API (`migdar-search-api`)

`server.py` is the whole service. It:

* reads the three `datapackage.json` files **over HTTP from
  `http://api.yodaat.org/data/{type}_in_es/datapackage.json` at boot** — i.e. the
  API discovers its own searchable-field list from the pipeline output, at
  startup, over the public internet;
* maps doc type → index (`publications` → `migdar__publications`, etc.);
* names `migdar__docs` as the document index for `/get/`;
* supplies a `rules(field)` function that turns Frictionless `es:*` annotations
  into search fields and boosts (see [data-model.md](data-model.md#how-fields-become-search-fields));
* configures `multi_match_type='best_fields'`, `multi_match_operator='and'`;
* wraps everything in `flask_cors.CORS(app)` — wide-open CORS;
* mounts the `apies` blueprint at `/`.

Deployed as gunicorn on port 8000 (`Dockerfile`), image
`hasadna/migdar-search-api`.

### 3. `apies`

The reusable blueprint doing the real work
(`blueprint.py` → `controllers.py` → `query.py`).

Notable design points, because they leak into the API's behaviour:

* **One Elasticsearch `_msearch` per request, one sub-query per doc type.**
  `size`/`offset` are therefore applied *per type*, and the interleaving of a
  multi-type result list is by rank-within-type, not by score.
* Queries are built as `function_score { bool { must, should, filter, must_not } }`.
  When a text query is present, `apply_scoring()` multiplies `_score` by
  `sqrt(doc.score)`. In Yodaat `score` is always `1`, so this is currently a no-op
  — the hook exists for editorial boosting later.
* Query params that carry structure (`filter`, `lookup`, `config`) are parsed with
  **`demjson3`, not `json`** — so unquoted keys, single quotes, and even a
  brace-less `key: value` string are accepted.
* Errors inside the search handler are caught and returned as
  `200 {"error": "..."}`, not as an HTTP error status.

### 4. The UI (`migdar-ui`, this repo)

* `src/app/api.service.ts` — the only place that talks to the API. Three methods:
  `fetch()` → `/search/<types>`, `count()` → `/search/count`, `document()` → `/get/<id>`.
* `src/app/search-manager.ts` — a small stateful wrapper: 300 ms debounce, keeps
  `offset`, appends pages, re-emits results one at a time.
* `src/app/filter-manager.service.ts` — holds the currently selected facet values,
  turns them into a `filter` object, and bootstraps the year slider by asking the
  API for the oldest and newest publication (`order=year` / `order=-year`, `size=1`).
* `src/app/constants.ts` — the hard-coded facet vocabulary (`FILTERS_CONFIG`),
  trilingual. **The API exposes no facet/aggregation endpoint**; the UI's filter
  options are a static list compiled into the front-end.
* `index.js` — an Express server that serves the three prebuilt locale bundles
  (`/`, `/en/`, `/ar/`) and, for `/item/**` URLs, calls `GET /get/<doc_id>`
  server-side to inject Open Graph title/description/image before returning HTML.
  It also exposes its own `POST /contact` (sends mail via SMTP) and redirects
  `/sitemap.xml` to `https://api.yodaat.org/data/sitemap.xml`.

## Site URL ↔ document id

The UI route `/item/**` passes the remaining path straight to `/get/`, so
document ids map one-to-one onto site URLs:

| `doc_id` | Page |
| --- | --- |
| `publications/AKXQK376` | `https://yodaat.org/item/publications/AKXQK376` |
| `org/580416634` | `https://yodaat.org/item/org/580416634` |
| `dataset/4168546c4d8672e3` | `https://yodaat.org/item/dataset/4168546c4d8672e3` |

Prefix with `/en` or `/ar` for the other locales. `/embed/<doc_id>` renders a
chart standalone for iframes; `/card/<doc_id>` and `/card-share/<doc_id>` are the
screenshot targets used by the `dataset-assets` pipeline.
