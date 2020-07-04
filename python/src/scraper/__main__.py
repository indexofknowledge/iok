#!/usr/bin/env python

import argparse
from .scrape import run_scrape


parser = argparse.ArgumentParser()
parser.add_argument(
    "--link", type=str, required=True, help="Link to IoK JSON graph file"
)
parser.add_argument("--out", type=str, help="Path of the output file")
parser.add_argument("--debug", action="store_true")

args = parser.parse_args()

# run the scraper
run_scrape(args.link, args.out, args.debug)
