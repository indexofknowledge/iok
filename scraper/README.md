# IoK Scraper

This directory holds some source files for scraping graph data from our blockstack app and generating an awesome-list by linearizing the graph by dependency. 

Since Blockstack (and by extension its storage system, Gaia) is designed to have human interaction, it's difficult to run our own Gaia node and a separate app to pull from that data and generate the awesome-lists. So, we have to scrape our own webapps! We need to fully render everything as of now, so that we load the graph, etc. We use puppeteer to render the webapp and get the graph data in plaintext. Then we reuse some of our original IoK python scripts to construct a networkx representation, linearize it, and convert it to an awesome-list.

## Development

```
# install scraper
npm install

# using a venv
venv venv
source venv/bin/activate

# install everything
pip install requirements.txt

# then you can try scraping
./scrape-awesome.sh
```