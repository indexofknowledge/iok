# Markdown Scraper

In an attept to get more data onto the IoK, let's attempt to scrape existing awesome-lists from GitHub using their raw Markdown files.

## Algorithm

Since READMEs and awesome-lists have no native notion of dependency, we greedily infer that based on heading hierarchy.

```
    """
    Maintain a list of regex "scopes" based on hierarchy.
    All matches of higher specificity becomes nodes with edges pointing to matches 
    of lower specificity. Upon encountering lower specificity, pop from the end, and start
    a new branch.

        example markdown:
            # Bitcoin
            Bitcoin is a cryptocurrency
            ## Links
            * [text](link)

        scopes per line executed:
            [H1]
            [H1, DESC]
            [H1, H2]
            [H1, H2, BULLET]

        graph representation per line executed:
            H1
            
            H1 <-- DESC
            
            H1 <-- DESC
            ^--H2

            H1 <-- DESC
            ^-- H2 <-- BULLET

    """
```

## Dev setup

```
# using a venv
virtualenv venv
source venv/bin/activate

# install everything
pip install -r requirements.txt

# then we can try scraping
python3 md_scrape.py https://raw.githubusercontent.com/sindresorhus/awesome/master/readme.md
```
