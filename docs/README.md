# Yodaat (יודעת / هي تعرف) — API Reference & User Manual

This folder documents the public HTTP API behind [yodaat.org](https://yodaat.org),
Israel's Knowledge Center on Women and Gender.

The API is read-only, unauthenticated, CORS-enabled and returns JSON. Anyone can
use it to search and retrieve the site's three content collections — publications,
organisations and datasets (statistics & the Gender Index).

**Base URL: `https://api.yodaat.org`**

```bash
# 20 publications about poverty, newest first
curl -sG https://api.yodaat.org/search/publications \
     --data-urlencode 'q=עוני' \
     --data-urlencode 'size=20' \
     --data-urlencode 'order=-year'
```

## Contents

| Document | What's in it |
| --- | --- |
| [architecture.md](architecture.md) | How the pieces fit together: UI → API → Elasticsearch → pipelines. Read this first if you're new to the project. |
| [api-reference.md](api-reference.md) | Every endpoint, every query parameter, every response field. The normative reference. |
| [query-language.md](query-language.md) | The `filter` / `lookup` / `context` mini-DSL: operators, multi-clause filters, scoring effects. |
| [data-model.md](data-model.md) | The three document types and all their fields, including which are searchable and how they're weighted. |
| [recipes.md](recipes.md) | Task-oriented cookbook — worked examples, including how the Yodaat UI itself queries the API. |
| [gotchas.md](gotchas.md) | Known quirks and traps. Read before you ship anything against this API. |

## The 60-second version

There are three **document types** (also called "doc types" or "types"):

| Type | Contains | `doc_id` shape | Rows (Aug 2026) |
| --- | --- | --- | --- |
| `publications` | Reports, articles, books, laws, videos — the library | `publications/<migdar_id>` | ~8,460 |
| `orgs` | Organisations, NGOs, government units, funds | `org/<entity_id>` | ~136 |
| `datasets` | Charts — both "Gender Statistics" and the "Gender Index" | `dataset/<md5-16>` | ~426 |

There are three endpoints:

| Endpoint | Purpose |
| --- | --- |
| `GET /search/<types>` | Search one, several or all types. Returns documents + per-type totals. |
| `GET /search/count` | Batch-count several named queries in one round trip. Returns counts only. |
| `GET /get/<doc_id>` | Fetch a single document by its id. |

Plus a static file tree of the underlying data at `GET /data/…` (CSVs, datapackage
schemas, chart images, XLSX exports, sitemaps) — see
[api-reference.md § Data files](api-reference.md#data-files-datapath).

## Conventions used in this documentation

* Examples use `curl -sG` with `--data-urlencode` because virtually every
  interesting query contains Hebrew and JSON, both of which must be
  percent-encoded. `-G` turns the `--data-urlencode` values into a query string.
* Where behaviour was verified against the live production service, it is
  stated as fact. Where behaviour is inferred from source only, it says so.
* "The UI" means the Angular app in this repository (`migdar-ui`).

## Source repositories

| Repo | Role |
| --- | --- |
| `migdar-ui` | The Angular 7 front-end at yodaat.org (this repo), plus a small Express server for SSR meta tags. |
| `migdar-search-api` | ~50 lines of Flask that configure and mount the `apies` blueprint. This *is* the API service. |
| [`apies`](https://github.com/OpenBudget/apies) | The reusable Flask blueprint that implements all endpoint and query logic. |
| `migdar-data-pipelines` | `dataflows`/`datapackage-pipelines` jobs that pull from Google Sheets + Zotero and index into Elasticsearch. |
| `migdar-k8s` | Helm charts; also the nginx config that defines what `api.yodaat.org` actually exposes. |

## Stability & etiquette

The API carries no versioning, no authentication and no published rate limit. It
is a small community service running on a modest cluster
(the search API pod is capped at ~48m CPU / 270Mi RAM). Please:

* cache aggressively — the data changes once a day at most (pipelines run at 02:02 UTC);
* prefer `/search/count` over N separate searches when you only need numbers;
* keep `size` modest and paginate rather than requesting thousands of rows;
* don't paginate past offset 10,000 (it silently returns nothing — see
  [gotchas.md](gotchas.md)).
