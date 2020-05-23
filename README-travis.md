# Deployment

We use Travis CI to deploy both the IoK webapp (`v4`) as well as to automate the generation of awesome-lists (`scraper`).

## `v4`

When triggered, this builds the React webapp and hosts it on Firebase hosting.

## `scraper` 

When triggered, this runs a webscraping script that checks the currently deployed version of `v4`, downloads the graph file as JSON, and uses that to generate an `awesome-list`. 

## Workflow

This is currently in the works, but there are few key design choices here to save compute and also for general automation.

1) For generation of awesome-lists, we can just use Travis CI. On push, we can use `scraper` as well as Travis CI (with our GitHub deploy/access keys) to push again directly to our repo.
2) We want to maintain `master` as our main branch, and probably restrict direct push access other than from pull requests from adjacent branches.

Prod builds of `v4` occur on a schedule off of `master`. Beta builds of `v4` currently occur on each push to `master`. Devs may manually deploy to their own workspaces.
