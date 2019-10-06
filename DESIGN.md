# Design Doc

NOTE: move this to separate doc later on


## Flow

Input to IoK occurs with: 
* Run generate script
  * Edits data file (json dep list)
  * Edits markdown list
* With files changed, submit PR according to `CONTRIBUTING.md`

NOTE: want to be able to tag posts

Alternative would be to parse the Markdown file itself
* But would need to input metadata manually

## Data retrieval

For now, load all IoK into memory as JSON, but need a way to scale using IPFS.
* Perhaps use a DHT!! Keyed on topic, category, etc.
* Support for more advanced queries