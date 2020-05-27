# IoK Scraper

This directory holds some source files for scraping graph data and generating an awesome-list by linearizing the graph by dependency. We've originally had to scrape our Blockstack app in a hacky way, but now can just visit the IPFS gateway at a specific hash:

```
python3 scrape.py --link $SCRAPE_LINK --out ../README.md
```
## Dev

```
# using a venv
venv venv
source venv/bin/activate

python3 install -r requirements.txt

python3 scrape.py --link $SCRAPE_LINK --out ../README.md
```