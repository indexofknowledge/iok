# Index of Knowledge (IoK)

This is a general overview of each of the modules. READMEs in their respective folders should be more up-to-date.

## Project structure

Description of folders and the projects they contain. In general, it's somewhat of a mono repo, where each directory in root contains code, config, and env to build each module. Root contains general deployment configs and scripts.

### `v4`

The `v4` folder contains a ReactJS app that allow users to create, view, and share IoKs. It uses an adjacency list graph as its main source of truth, fetched from some storage backend (e.g. Blockstack, IPFS, local file, etc.) and populates an interactive graph using CytoscapeJS.

### `scraper`

This contains an old experimental webscraper based off of puppeteer that scrapes IoK graph data from the web. It also contains retrofitted scripts from `legacy` that linearize the scraped graph data into an awesome-list.

### `md-scraper`

Handy webscraper that turns statically hosted markdown files (e.g. awesome-lists on GitHub) into our graph representation. It infers dependency greedily based on heading and text hierarchy.

### `funcs`

Cloud functions that we use primarily to interface with our various storage backends.

### `legacy` 

This contains the old IoK client using CommonJS and Cytoscape. Storage happens on GitHub. There was also a mechanism for taking IoK data and linearizing it to programatically generate the README, in the format of an awesome-list. Mostly deprecated, but there's some bits we can salvage. 

