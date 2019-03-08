Babelsheet supports versioning - it assumes that every spreadsheet in a worksheet is a specific version of translations. It'll use the name of each sheet as a key when saving it - either via CLI or a producer.

**Obtaining a specific sheet**
It's possible to obtain only one sheet by settings a variable BABELSHEET_SPREADSHEET_NAME (if it's not provided it'll default to 'Sheet1'). If that variable isn't set then Babelsheet will download all the versions (sheets).

**Obtaining a specific version with API**
When obtaining translations with **babelsheet-api** it's possible to either explicitly provide a `version` parameter, f.e.:
`GET /translations?version=Sheet2`
If that parameter isn't provided then API will use BABELSHEET_SPREADSHEET_NAME environment variable.

