For BabelSheet to know how to handle your translations, you need to stick with very simple spreadsheet markup.

**Metadata**:
* `$$$` - determines column with optional comments, each comment describes whole row
* `###` - determines column with optional tags, each tag describes whole row, there might be more tags per row and they should be separated by a comma
* `>>>` - determines column with translation key, there might be more such columns placed one after another, each column makes another key which is nested, e.g. `CORE.LABELS` or `FRONT.HEADER.TITLE`.
* locale, e.g. `en_US`, `pl_PL` and others - determines column with translations for specific locale


Example:

|$$$       | ###        | >>>   | >>>    | >>>   | en        | pl  |
|----------|------------|-------|--------|-------|-----------|-----|
|          |            | CORE  |        |       |           |     |
|          |            |       | LABELS |       |           |     |
| comment1 | tag1, tag2 |       |        | YES   | Yes       | Tak |
| comment2 | tag1       |       |        | NO    | No        | Nie |
|          |            | FRONT |        |       |           |     |
|          |            |       | HEADER |       |           |     |
|          |            |       |        | TITLE | Something | Coś |

Nothing is more self-explanatory then [a working example](https://docs.google.com/spreadsheets/d/1AUAKxhuZyjYl4NdpQCLBcSZe2snKAOjcXArlHRIn_hM/edit?usp=sharing).
