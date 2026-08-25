# The filter / lookup query language

`filter`, `lookup` and the `filters` key inside `/search/count`'s `config` all use
the same small expression language. This page is the complete reference for it.

## Shape

An expression is **an object**, or **an array of objects**:

```jsonc
// single clause
{"life_areas": "עוני", "year__gte": 2020}

// several clauses — OR'ed together
[
  {"life_areas": "עוני"},
  {"life_areas": "משפחה", "year__gte": 2020}
]
```

* Within one object, all rules must match → **AND**.
* Between objects in the array, any may match → **OR**.

Formally, an object becomes an ES `bool` clause and the array becomes a
`should` list with `minimum_should_match: 1`.

## Values

| Value form | Meaning | ES clause |
| --- | --- | --- |
| `"field": "value"` | field equals value | `term` |
| `"field": ["a", "b"]` | field equals **any** of these | `terms` |

For array-valued document fields (`tags`, `life_areas`, …) "equals" means
"contains", because Elasticsearch indexes each element separately. So
`{"life_areas": ["עוני", "משפחה"]}` matches documents tagged with *either*.

To require **all** of them, use the `all` operator (below).

> ⚠️ **Equality only works exactly on `keyword` fields.** On analyzed (`text`)
> fields, `term` matches individual tokens, so a value containing a space matches
> nothing: `{"regions": "כל הארץ"}` returns 0 while `{"regions__like": "כל הארץ"}`
> returns 105. The analyzed fields in Yodaat are `regions`, `specialties`,
> `provided_services` and `target_audiences` on `orgs`; everything else in the
> [vocabulary tables](data-model.md#controlled-vocabularies) is a keyword field.
> When in doubt, use `__like`.

## Operators

Append `__<op>` to a field name.

| Operator | Meaning | Example |
| --- | --- | --- |
| `gt`, `gte`, `lt`, `lte` | numeric / lexical range | `{"year__gte": 2015, "year__lte": 2020}` |
| `eq` | explicit range-style equality | `{"year__eq": 2020}` |
| `not` | negate — moves the clause to `must_not` | `{"title_kw__not": "…"}` |
| `like` | analyzed text match (`match`) rather than exact term | `{"notes__like": "אלימות"}` |
| `exists` | the field is present | `{"org_website__exists": true}` |
| `empty` | the field is absent | `{"hotline_phone_number__empty": true}` |
| `all` | array field contains **every** listed value | `{"life_areas__all": ["עוני", "משפחה"]}` |
| `bounded` | geo bounding box — `[[lonTL, latTL], [lonBR, latBR]]` | *(no geo fields in Yodaat)* |

`not` is special: it doesn't build a negated query, it relocates an otherwise
normal clause into `must_not`. So `{"tags__not": ["a","b"]}` excludes documents
carrying *either* tag.

### Two operators on one field

Field names are unique keys in a JSON object, so to constrain the same field twice
in the same clause, suffix the key with `#` and a number. Everything from `#`
onwards is stripped before the field name is parsed:

```json
{
  "year__gte": 2015,
  "year__lte": 2020,
  "life_areas": "עוני",
  "life_areas#1": ["משפחה", "משפט"]
}
```

→ published 2015–2020, tagged `עוני`, **and** tagged with at least one of
`משפחה` / `משפט`.

## Restricting a clause to one doc type: `_type`

Inside a clause, the reserved key `_type` limits that clause to one or more doc
types instead of applying it to all of them:

```json
[
  {"_type": "datasets", "kind": "Gender Index"},
  {"_type": "publications", "year__gte": 2020}
]
```

> ⚠️ **`_type` mislabels the `type` field of results.** Verified on production:
> `/search/all?filter=[{"_type":"datasets","kind":"Gender Index"}]` returns
> genuine dataset documents, but reports `"type": "publications"` on every hit
> and files the count under `search_counts.publications`. See
> [gotchas.md](gotchas.md#_type-narrowing-mislabels-results). Prefer naming the
> types in the URL path (`/search/datasets`) over `_type`.

## `filter` vs `lookup` vs `context`

All three narrow the result set. They differ in where the clause lands and
therefore in whether it moves relevance:

| Parameter | ES placement | Affects `_score`? | Use for |
| --- | --- | --- | --- |
| `filter` | `bool.filter.should` (`minimum_should_match: 1`) | **No** | Facets, category tabs, year ranges — anything the user picked explicitly. |
| `lookup` | `bool.should` (`minimum_should_match: 1` on the outer bool) | **Yes** | "More like this" — related items, where you want closer matches ranked higher. |
| `context` | `bool.filter.must` — a `multi_match` with `operator: or` over the type's inexact fields | No | "Search within these results" — a free-text pre-restriction layered under `q`. |

The UI uses `lookup` in exactly one place: the "related items" strip on a
publication page (`item-page-publication.component.ts`) passes
`{tags: <this doc's tags>, title_kw__not: <this doc's title>}` as `lookup`, so
documents sharing more tags float to the top. The organisation and dataset pages
pass a comparable object as `filter` instead, so their related lists are
unranked.

## Parsing is lenient

`filter`, `lookup` and `config` are parsed by **`demjson3`**, not `json`. All of
these are accepted (verified on production):

```
filter={"year": 2024}          standard JSON
filter={year: 2024}            unquoted keys
filter={year: 2024, life_areas: 'עוני'}   single-quoted strings
filter=year: 2024              no braces at all — wrapped automatically
```

Anything not starting with `[` or `{` gets `{` … `}` wrapped around it before
parsing. Convenient by hand; still emit strict JSON from code.

Remember to percent-encode the whole thing — with `curl`, use
`-G --data-urlencode 'filter=…'`.

## Worked examples

```bash
# Hebrew-language reports about gender violence, 2018 or later
curl -sG https://api.yodaat.org/search/publications --data-urlencode 'filter={
  "languages": "עברית",
  "item_kind": "דו”ח",
  "life_areas": "אלימות מגדרית",
  "year__gte": 2018
}'

# Organisations that run a hotline AND work nationally
curl -sG https://api.yodaat.org/search/orgs --data-urlencode 'filter={
  "compact_services": "קו חם, סיוע במשבר, מחסה ומקלט",
  "regions": "כל הארץ"
}'

# Gender Statistics charts, excluding horizontal bar charts
# (this is exactly what the site's statistics header carousel requests)
curl -sG https://api.yodaat.org/search/datasets \
  --data-urlencode 'filter={"kind":"Gender Statistics","chart_type__not":"hbars"}' \
  --data-urlencode 'size=4'

# Either poverty publications or any organisation in the north
curl -sG https://api.yodaat.org/search/publications,orgs --data-urlencode 'filter=[
  {"_type": "publications", "life_areas": "עוני"},
  {"_type": "orgs", "regions": "צפון"}
]'
```
