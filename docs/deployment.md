# Deployment

We use Travis CI to deploy both the IoK webapp (`v4`) as well as to automate the generation of awesome-lists (`scraper`).

## `v4`

When triggered, this builds the React webapp and hosts it on Firebase hosting.

## `scraper` 

When triggered, this runs a webscraping script that checks the currently deployed version of `v4`, downloads the graph file as JSON, and uses that to generate an `awesome-list`. 

## Workflow

This is currently in the works, but there are few key design choices here to save compute and also for general automation.

1) For generation of awesome-lists, we could run a cron job, but that gets a bit expensive since we have to pay for a server. Instead, let's use Travis CI. On push, we can use `scraper` as well as Travis CI (with our GitHub deploy/access keys) to push again directly to our repo.
2) We want to maintain `master` as our main branch, and probably restrict direct push access other than from pull requests from adjacent branches.

DRAFT: Workflow is as follows... `master` is our main branch, and `develop` is essentially our working copy of it. We can make PR from `develop` into `master` so long as Travis passes. We want to trigger generation of awesome-lists only when our PR target is `master`.

So, we need to set up a Travis workflow such that:

* Builds of `v4` trigger on each push.
* Builds of `scraper` and subsequent generation of awesome-lists only occur when `master` is the PR target
  * Enforce branch rules such that `develop` is always kept in sync with `master`, so that we get all the awesome-list changes.

# From the UI

We also want a mechanism through which we can trigger builds of awesome-list from the `v4` webapp UI. Perhaps this can be done using the GitHub API. We would have a button that would fork the repo and make a PR. This would be difficult though since we'd have to require everyone auth with Github, etc. Requires more thought