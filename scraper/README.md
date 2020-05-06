# IoK Scraper

This directory holds some source files for scraping graph data from our react app and generating an awesome-list by linearizing the graph by dependency. 

Since Blockstack (and by extension its storage system, Gaia) is designed to have human interaction, it's difficult to automate gathering this graph data. So, we have to scrape our own webapps! We need to fully render everything as of now, so that we load the graph, etc. We use puppeteer to render the webapp and get the graph data in plaintext. Then we reuse some of our original IoK python scripts to construct a networkx representation, linearize it, and convert it to an awesome-list. Everything's tied together using a bash script `scrape-awesome.sh`. This script expects an environment variable `DEPLOY_TARGET` to know whether to scrape from prod or beta builds.

```
$ ./scrape-awesome.sh -h
usage: scrape-awesome [vh] [-f graphfile]
    -v      verbose
    -f      graph file instead of scraping
    -h      print help
```

## Development

```
# install puppeteer, which comes with chromium
$ npm install -g puppeteer

# using a venv
$ venv venv
$ source venv/bin/activate

# install everything for the IoK linearizer
$ pip install -r requirements.txt

# then you can try scraping
$ DEPLOY_TARGET=prod ./scrape-awesome.sh -v
running scrapper
------ scrape successful ------
make graph prettier
got graph data, sample: 
{
    "nodes": [
        {
            "data": {
                "name": "math",
                "node_type": 1,
                "id": "0ed8f58bf8b3ae5ba6b882961eff9068c84268522fdf1b9a7fdc90cae0e9a703"
            }
        },
        {
generating awesome-list
got awesome-list, sample: 
# Index of Knowledge

[![Build Status](https://travis-ci.com/rustielin/iok.svg?branch=master)](https://travis-ci.com/rustielin/iok)

The Decentralized Index of Knowledge (DIoK) is a curated collection of resources for blockchain, grouped by topic and ordered by pedagogical dependency. We store data as a graph, allowing programmatic creation of front-ends such as interactive graph visualizations as well as awesome-lists.

## Table of Contents

* [bitcoin](#bitcoin)
* [computer science](#computer%20science)
```
