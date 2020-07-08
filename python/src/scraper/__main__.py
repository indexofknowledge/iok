#!/usr/bin/env python

import argparse
from .scrape import run_scraper

parser = argparse.ArgumentParser()
input_group = parser.add_mutually_exclusive_group(required=True)
input_group.add_argument("--link", type=str, help="Link to IoK JSON graph file")
input_group.add_argument("--file", type=str, help="Path to IoK JSON graph file")
parser.add_argument("--out", type=str, help="Path of the output file")
parser.add_argument("--debug", action="store_true")
args = parser.parse_args()

run_scraper(link=args.link, file=args.file, out=args.out, debug=args.debug)
