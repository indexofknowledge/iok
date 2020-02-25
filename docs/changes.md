# Changes

Haven't touched the IoK in a while and after taking a few steps back, some changes and features:

## Redesign build/deployment pipeline

Currently, we've hacked Travis into:

* building both `v4` and `scraper`
* deploying to prod and beta firebase projects (hosting)
* running the scraper
* auto-pushing the linearized graph into an awesome-list in `master`

This creates an issue where `master` and `develop` diverge since the awesome-list is only updated in `master`. Some potential fixes:

* we sync `develop` with `master` after pushing the awesome-list changes
* have another branch e.g. `awesome` that only contains the awesome list


## Smarter default graph

Currently the default graph is hardcoded in `v4`. We can make this smarter and incorporate older ways of interacting with the IoK by integrating with Google Docs (e.g. an [IoK Cache](https://docs.google.com/document/d/1HvcEoOh98xi_mhjXAfBsq2p79n5Vc_TAN0HX8owarnI/) document). We would need to write another webscraper that would: on push (e.g. Travis on `develop` or `master`) scrape the contents of the Google Doc, gather the contents into a graph json file that is then pushed to the repo.

We might face an issue in authentication, but perhaps we can get away with that by making it a public file. Perhaps we can do the same encryption of travis keys, etc. Needs investigation

## Graph discover/join webserver

I want to write a webserver (e.g. in Rocket via Rust for learning :)) that serves two primary objectives: 

* consist of a public index of IoKs (e.g. list people's blockstack IDs)
* some sort of graph merging functionality
  * perhaps a new editor that puts your IoK and other IoK side-by-side, and previewing a graph merge operation
  * you should then be able to make edits to the preview, e.g. to fix some of the edge or rename some of the nodes. clicking save afterwards...


The easiest way would be to maintain the public index on Firebase (e.g. firestore), and the graph merging/preview functionality be in a cloud function, but also rust tho...

## Basic additions

I should really be using github issues for this, but:

* edit node functionality (e.g. changing the contents. perhaps would just delete the previous and insert new node overriding all previous edges)
* autosave (sounds like a pretty good idea overall, but would need an undo button/stack as a prerequisite. perhaps we could use blockstack as a cache)