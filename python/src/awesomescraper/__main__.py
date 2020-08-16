import requests
import re
import os
import sys

START = "https://github.com/sindresorhus/awesome"
RAW_PREFIX = "https://raw.githubusercontent.com/"
FOLDER = "awesomes"

if not os.path.exists(FOLDER):
    print("Creating a home for these bb's")
    os.makedirs(FOLDER)


def write_raw_md(awesome_link):

    res = requests.get(awesome_link)

    if not res.ok:
        print("Link fetch failed lmao")
        return ""

    # get the raw data
    # XXX: this assumes that there's only one README per page
    match = re.search(
        r'<a.*href=[\'"](.*)[\'"].*readme.md.*</a>', res.text, re.IGNORECASE
    )
    if match:
        path = match.groups()[0]
        path = re.sub("/blob", "", path)
        dirs = [p for p in path.split("/") if p]
        username = dirs[0]
        awesomename = dirs[1]
        rawurl = RAW_PREFIX + path
        print(f"Attempt scrape {rawurl}")
        res = requests.get(rawurl)
        if not res.ok:
            print("You dumbo, the raw script broke!!! >:(")
            return ""
        filename = f"{awesomename}-{username}.md"
        with open(f"{FOLDER}/{filename}", "w") as f:
            f.write(res.text)
            print("SUCCess!")
            return res.text
    else:
        print("um wat")
        return ""


# stolen from mdscraper!!!
def _get_link(line):
    """Returns link text and link of parsed markdown link, if regex matched"""
    match = re.search(r"(?:__|[*#])|\[(.*?)\]\((.*?)\)", line)
    if match:
        groups = match.groups()
        return groups[0], groups[1]
    return None


# get each of the links from the awesome awesome list
awesomes = []
big_awesome = write_raw_md(START)
for line in big_awesome.splitlines():
    link_stuff = _get_link(line)
    if not link_stuff:
        continue
    text, link = link_stuff
    if not link or "http" not in link:
        continue
    awesomes.append(link)

# cache a scraped copy of the awesome awesome list
with open(f"{FOLDER}/awesomes.md", "w") as f:
    for a in awesomes:
        f.write(f"{a}\n")

# get all the raw awesomes from each
for a in awesomes:
    if not write_raw_md(a):
        print(f"Failed {a} !!!! SAD!!!!")
