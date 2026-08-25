# Data model

Field reference for the three document types. Everything here is derived from the
live Frictionless schemas the API itself reads at boot:

* `https://api.yodaat.org/data/publications_in_es/datapackage.json`
* `https://api.yodaat.org/data/orgs_in_es/datapackage.json`
* `https://api.yodaat.org/data/datasets_in_es/datapackage.json`

If you need machine-readable field lists, fetch those — they are the source of
truth and they change when the pipelines change.

## Multilingual field families

Yodaat is trilingual (Hebrew, Arabic, English). Two different conventions carry
translations, and they behave differently:

### 1. Suffixed scalars — `field`, `field__ar`, `field__en`

Free-text fields written by hand in each language: `org_name__ar`,
`chart_title__en`, `objective__ar`, `series_abstract__en`, and so on. The unsuffixed
name is Hebrew. A translation may be empty.

The UI resolves these with `I18nService._(item, 'org_name')`, which prefers
`org_name__<locale>` and falls back to `org_name`.

### 2. Suffixed arrays — `field`, `field__en`, `field__ar`, `field__all`

Controlled vocabularies (tags, life areas, languages, org kinds, …). The pipeline
splits the source cell on a delimiter, fuzzy-matches each value against a shared
translation spreadsheet, and emits **four parallel arrays**:

| Suffix | Contents |
| --- | --- |
| *(none)* | the canonical **Hebrew** values |
| `__en` | English, same length and order |
| `__ar` | Arabic, same length and order |
| `__all` | every known synonym across all languages, concatenated — a search-only field |

Two rules follow from this:

* **Filter on the unsuffixed (Hebrew) field.** It is the canonical vocabulary, it
  is what `constants.ts` in the UI enumerates, and it is stable. The `__en` /
  `__ar` arrays are lower-cased translations (`"gender violence"`, not
  `"Gender Violence"`).
* **`__all` is for matching, not display.** It is deduplicated across languages
  and can contain oddities — one observed publication has
  `languages__all: ["العبرية", "heb", "עברית$obɓ - العبرية", "עברית", "hebrew"]`.

Positional pairing between `field[i]` and `field__en[i]` is what lets the UI render
a tag in the reader's language while linking to a search on the Hebrew value —
see `I18nService.tags()`.

## Fields shared by all three types

| Field | Type | Notes |
| --- | --- | --- |
| `doc_id` | string | Primary key. `publications/<migdar_id>`, `org/<entity_id>`, `dataset/<md5-16>`. Maps directly to `/item/<doc_id>` on the website. |
| `title_kw` | string, keyword | The document's display title, unanalyzed. Used for alphabetical sorting (`order=title_kw`) and for "everything except this one" filters (`title_kw__not`). |
| `year` | integer | A single sortable year. For publications it's parsed out of `pubyear`; for orgs it is the **current year** (a placeholder, not the founding year — that's `year_founded`); for datasets it's the latest year present in the data. |
| `revision` | integer | Pipeline stamp, `ISO-year × 100 + ISO-week + 7`. Rows older than the current run's revision are deleted at the end of each run. |
| `score` | number | Editorial boost multiplier. Currently constant `1.0` for every document. Multiplied into `_score` as `sqrt(score)` when a text query is present. |
| `create_timestamp` | number | Unix epoch seconds, preserved across pipeline runs for existing `doc_id`s. This is the "date added to Yodaat" field — sort `-create_timestamp` for "recently added". |

---

## `publications`

The library: ~8,460 reports, articles, books, laws, datasets, videos and podcasts.
Sourced from a Zotero library plus a multi-tab Google Sheet.

| Field | Type | Search role | Notes |
| --- | --- | --- | --- |
| `title` | string | inexact `^3` + hebrew `^10` | Primary title. |
| `notes` | string | inexact `^3` + hebrew `^10` | Abstract / description. Often long; URLs in it are linkified by the pipeline. |
| `authors` | string | inexact `^10` | Free text, may hold several names. |
| `publisher` | string | inexact `^10` | |
| `pubyear` | string | inexact | Raw publication-year text, as entered. Use `year` for anything numeric. |
| `year` | integer | numeric | First 4-digit year found in `pubyear`. |
| `url` | string | inexact | Link to the item itself. |
| `migdar_id` | string | inexact | Internal id (also the `doc_id` suffix). Zotero keys look like `AKXQK376`. |
| `bib_title`, `bib_related_parts` | string | inexact | Bibliographic container info (journal, series). |
| `page_title` | string | inexact | Copy of `title` used for page titles. |
| `title_kw` | string | exact | See shared fields. |
| `tags` ×4 | array | exact | Free-form subject tags. The most commonly used facet on the site. |
| `life_areas` ×4 | array | exact | 16-value controlled vocabulary — see [below](#life_areas). |
| `languages` ×4 | array | exact | `עברית` / `אנגלית` / `ערבית`. |
| `item_kind` ×4 | array | exact | What kind of thing it is — see [below](#item_kind-publications). |
| `source_kind` ×4 | array | exact | What kind of body produced it — see [below](#source_kind-publications). |

---

## `orgs`

~136 organisations: NGOs, government and municipal units, academic centres,
unions, funds, Facebook communities.

| Field | Type | Search role | Notes |
| --- | --- | --- | --- |
| `org_name`, `org_name__ar` | string | inexact `^3` + hebrew `^10` | |
| `org_name__en` | string | inexact | Note: **not** boosted, unlike the Hebrew and Arabic names. |
| `alt_names` | array of string | inexact `^3` + hebrew `^10` | Up to five alternative names plus `org_name`, so aliases are searchable. |
| `entity_id` | integer | numeric | Israeli registered-entity number (מספר עמותה). Forms the `doc_id`. |
| `tagline` ×(he/ar/en) | string | inexact | One-line purpose statement. |
| `objective` ×(he/ar/en) | string | inexact | Longer description; URLs are linkified. |
| `year_founded` | integer | numeric | The real founding year (`year` is not). |
| `hotline_phone_number` | string | inexact | Public hotline, where one exists. |
| `org_website`, `org_facebook`, `org_phone_number`, `org_email_address`, `logo_url` | string | **excluded from search** | `es:index: false` keeps them out of the full-text field list, so `q` never matches them. They are returned in full, and `__exists` / `__empty` filters do work (113 orgs have a website, 122 a logo). Equality filters do not — a `term` on a complete URL returns 0. |
| `title_kw` | string | exact | Copy of `org_name`. |
| `life_areas` ×4 | array | exact | Same vocabulary as publications. |
| `languages` ×4 | array | exact | Languages services are offered in. |
| `tags` ×4 | array | exact | |
| `org_kind` ×4 | array | exact | Legal / structural type — see [below](#org_kind-orgs). |
| `compact_services` ×4 | array | exact | Short service taxonomy, the main "what do they do" facet — see [below](#compact_services-orgs). |
| `regions` ×4 | array | inexact | Geography. **Not a keyword field** — see the note below. |
| `specialties` ×4 | array | inexact | Free-text areas of expertise. Not a keyword field. |
| `provided_services` ×4 | array | inexact | Longer-form services list; `compact_services` is derived from it. Not a keyword field. |
| `target_audiences` ×4 | array | inexact | Not a keyword field. |

> **`regions`, `specialties`, `provided_services` and `target_audiences` are
> analyzed text, not keywords — plain equality filters on them silently fail for
> multi-word values.** A `term` filter matches individual *analyzed tokens*, so
> `{"regions": "צפון"}` works (9 orgs) but `{"regions": "כל הארץ"}` returns **0**,
> even though 105 organisations carry that exact value. Use `__like` for anything
> containing a space: `{"regions__like": "כל הארץ"}` → 105. (Both verified against
> production.) `life_areas`, `tags`, `languages`, `org_kind` and
> `compact_services` *are* keyword fields and filter exactly.

The UI's organisation page also expects a logo at
`https://yodaat.org/assets/logos/<entity_id>.png` — a static asset in this repo,
not something the API serves.

---

## `datasets`

~426 charts. Two distinct populations live in this type, separated by `kind`:

| `kind` | Count (Aug 2026) | What it is |
| --- | --- | --- |
| `Gender Statistics` | 244 | Standalone statistical charts across all life areas. |
| `Gender Index` | 180 | The indicators making up Yodaat's composite Gender Index. |
| *(null)* | 2 | Two charts carry no `kind` and therefore appear in neither section of the site. |

Always filter on `kind` — the UI treats them as two separate sections
(`/stats` vs `/gender-index`) and the URL parameter `kind=stats` / `kind=gender_index`
on the search page maps to exactly this filter.

### Chart-level fields

| Field | Type | Search role | Notes |
| --- | --- | --- | --- |
| `kind` | string | exact | `Gender Statistics` or `Gender Index`. |
| `chart_title` ×(he/ar/en) | string | inexact `^3` + hebrew `^10` | |
| `chart_abstract` ×(he/ar/en) | string | inexact | |
| `chart_type` | string | inexact | One of `line`, `stacked`, `hbars`, `line mw`, `stacked mw`. The `mw` suffix means the series are men-vs-women and get the site's fixed gender palette (see `analyzeColors()` in `src/app/constants.ts`). |
| `gender_index_dimension` | string | inexact | Only meaningful for `kind = Gender Index` — which dimension of the index this indicator belongs to (e.g. `שוק העבודה`). Used as the anchor on `/gender-index#<dimension>`. |
| `item_type` | string | exact | e.g. `Data series`. |
| `author` ×(he/ar/en) | string | inexact | |
| `institution` ×(he/ar/en) | string | inexact | |
| `full_data_source` | string | inexact | Link to the complete underlying data. |
| `last_updated_at` | string | inexact | Free-text date, as entered by editors. |
| `num_datasets` | integer | numeric | Number of entries in `series`. |
| `year` | integer | numeric | Latest year across all series. |
| `life_areas` ×4 | array | exact | |
| `tags` ×4 | array | exact | |
| `language` ×4 | array | exact | **Singular** here — `language`, `language__en`, … — unlike publications and orgs, which use `languages`. Always `heb,eng,ara`. |
| `title_kw` | string | exact | Copy of `chart_title`. |
| `series` | array of object | **not indexed** | The actual chart data. Returned in full but entirely unqueryable — even `series__exists` matches nothing. Filter on the chart-level fields and read `series` from the result. |

### `series[]` — one entry per data series

| Field | Notes |
| --- | --- |
| `series_title` ×(he/ar/en) | Defaults to `gender` when blank. |
| `series_abstract` ×(he/ar/en) | |
| `gender` ×(he/ar/en) | Series label — often `נשים` / `גברים`, but can be any category. Drives the chart colour rules. |
| `units` | One of `אחוזים עד 100`, `מספר`, `מספר עד 1`, `ש"ח`, `שנים`. Percentages given as 0–1 in the source are normalised to 0–100 by the pipeline. |
| `source_description` ×(he/ar/en) | Attribution line shown under the chart. |
| `source_detail_description` | Extra provenance, used when there's no `source_url`. |
| `source_url` | Link to the original data. |
| `order_index` | Sort key. Series within a chart are pre-sorted by it; the Gender Index browser also sorts *charts* by `series[0].order_index`. |
| `dataset` | The points: `[{"x": "2004", "y": 15.2, "q": false}, …]`. `x` is a **string** (usually a year), `y` a number, `q` marks an extrapolated/estimated point. |

### Chart assets

Every dataset has pre-rendered files under `/data/` (see
[api-reference.md](api-reference.md#data-files-datapath)):

```
https://api.yodaat.org/data/dataset/<hash>.png            # chart image (Hebrew)
https://api.yodaat.org/data/en/dataset/<hash>.png         # English
https://api.yodaat.org/data/ar/dataset/<hash>.png         # Arabic
https://api.yodaat.org/data/dataset/<hash>-share.png      # social card
https://api.yodaat.org/data/dataset/<hash>.xlsx           # data as a spreadsheet
```

where `<hash>` is the part of `doc_id` after `dataset/`.

---

## Controlled vocabularies

These are the exact Hebrew values to filter on. Source: `src/app/constants.ts`
(`FILTERS_CONFIG`), which is also what the site's facet UI renders. English and
Arabic labels shown for reference — **filter on the Hebrew**.

### `life_areas`

Applies to all three types.

| Hebrew | English | Arabic |
| --- | --- | --- |
| `אלימות מגדרית` | Gender Violence | عنف جندريّ |
| `ביטחון` | Security | أمن |
| `בריאות ומיניות` | Health & Sexuality | صحة وجنسانيّة |
| `דת` | Religion | دين |
| `חברה בישראל` | Society in Israel | مجتمع في إسرائيل |
| `חינוך והשכלה` | Education | تربية وتعليم |
| `כלכלה ושוק העבודה` | Economy & Labor Market | اقتصاد وسوق العمل |
| `מדע, טכנולוגיה וסביבה` | Science, Technology & Environment | العلم، التكنولوجيا والبيئة |
| `מעגל החיים וזמן` | Life Cycle & Time | دائرة الحياة والوقت |
| `משפחה` | Family | عائلة |
| `משפט` | Law | قانون |
| `עוני` | Poverty | فقر |
| `עוצמה` | Power | قوة |
| `פמיניזם` | Feminism | نسويّة |
| `תקשורת` | Media | إعلام |
| `תרבות וספורט` | Culture & Sport | ثقافة ورياضة |

### `languages`

`אנגלית` (English), `עברית` (Hebrew), `ערבית` (Arabic).

### `item_kind` (publications)

`איורים ותמונות`, `אתר אינטרנט`, `דו”ח`, `דף נתונים`, `הקלטות שמע והסכתים`,
`הרצאות וכנסים`, `חקיקה ומשפט`, `כתבות ומאמרים`, `מאגר נתונים`,
`מדריכים, מערכי שיעור`, `מחקר אקדמי`, `נייר עמדה`, `סדרת נתונים`, `סיפורת, שירה`,
`ספר עיון`, `סרטונים/סרטים`

> Note the typographic quote in `דו”ח` (U+201D), not a straight `"`. Copy it exactly.

### `source_kind` (publications)

`אקדמיה`, `ארגון בינלאומי`, `אתר אינטרנט`, `גוף מחקר עצמאי`, `חברה אזרחית`,
`כלי תקשורת`, `כתב עת`, `מגזר פרטי`, `מגזר ציבורי`, `משרד ממשלתי`, `ספר`,
`פרלמנט`, `צבא`

### `org_kind` (orgs)

`איגוד/התאגדות מקצועית`, `גוף/תכנית ממשלתית`, `יחידה או תכנית עירונית`,
`מרכז אקדמי/תכנית לימודים`, `עמותה/חל"צ`, `פורום/התארגנות`, `קהילת פייסבוק`,
`קואליציית ארגונים`, `קליניקה משפטית`, `קרן פילנתרופית`

### `compact_services` (orgs)

`איגוד והתארגנות עובדות ועובדים`, `אירועים תרבותיים וקהילתיים`,
`העלאת מודעות וקמפיינים`, `ייעוץ ומיצוי זכויות, ליווי מול רשויות`,
`לובי וקידום מדיניות`, `מחקר ומידע, ארכיון, ידע פמיניסטי`, `מענקים, מלגות ופרסים`,
`מערך התנדבות`, `קבוצות תמיכה וטיפול נפשי`, `קו חם, סיוע במשבר, מחסה ומקלט`,
`קורסים, הכשרות, התמחויות ומפגשים מקצועיים`

### `regions` (orgs)

`בינלאומי`, `דרום`, `כל הארץ`, `מרכז`, `צפון`

### `tags`

Open vocabulary — thousands of values, no enumeration. Discover them by reading
`tags` off search results, or from the tag sitemaps at
`/data/sitemap.tags-hebrew.xml`.

---

## How fields become search fields

`migdar-search-api/server.py` defines a `rules(field)` function that inspects the
Frictionless annotations on each schema field and returns a list of
`(kind, suffix)` pairs. `apies` then uses those to build the query:

| Annotation | Search kind | Boost |
| --- | --- | --- |
| `es:title` or `es:hebrew`, plus `es:keyword` | `exact` | `^10` |
| `es:title` or `es:hebrew` | `inexact` **and** `natural` | `^3`, and `.hebrew^10` |
| `es:boost` plus `es:keyword` | `exact` | `^10` |
| `es:boost` | `inexact` | `^10` |
| `es:keyword` | `exact` | — |
| anything else (string) | `inexact` | — |
| `es:index: false` | *(excluded entirely)* | — |

Where:

* **exact** fields are matched with a `terms` clause against the whole query, each
  word, and each adjacent word pair;
* **inexact** fields go into the `multi_match`;
* **natural** fields are the `.hebrew` sub-fields created by
  `BoostingMappingGenerator` for `es:title` / `es:hebrew` string fields, analyzed
  with the Hebrew analyzer.

Non-string fields (integers, numbers, objects) are never full-text searched — but
they remain filterable and sortable.

### Searchable fields per type

Computed from the live schemas:

**publications**

* exact: `tags`, `life_areas`, `languages`, `source_kind`, `item_kind` (each ×4 language variants), `title_kw`
* inexact: `title^3`, `notes^3`, `publisher^10`, `authors^10`, `pubyear`, `url`, `migdar_id`, `bib_title`, `bib_related_parts`, `page_title`, `doc_id`
* natural: `title.hebrew^10`, `notes.hebrew^10`

**orgs**

* exact: `languages`, `life_areas`, `tags`, `org_kind`, `compact_services` (each ×4), `title_kw`
* inexact: `org_name^3`, `org_name__ar^3`, `alt_names^3`, `org_name__en`, `tagline`/`__ar`/`__en`, `objective`/`__ar`/`__en`, `hotline_phone_number`, `regions`, `specialties`, `provided_services`, `target_audiences` (each ×4), `doc_id`
* natural: `org_name.hebrew^10`, `org_name__ar.hebrew^10`, `alt_names.hebrew^10`

**datasets**

* exact: `kind`, `item_type`, `tags`, `life_areas`, `language` (each ×4 where applicable), `title_kw`
* inexact: `chart_title^3`, `chart_title__ar^3`, `chart_title__en^3`, `chart_abstract`/`__ar`/`__en`, `author`/`__ar`/`__en`, `institution`/`__ar`/`__en`, `chart_type`, `gender_index_dimension`, `full_data_source`, `last_updated_at`, `doc_id`
* natural: `chart_title.hebrew^10`, `chart_title__ar.hebrew^10`, `chart_title__en.hebrew^10`

Because `doc_id` is an inexact search field on every type, `q=<a doc id>` is a
usable (if inefficient) way to look something up when you can't use `/get/`.
