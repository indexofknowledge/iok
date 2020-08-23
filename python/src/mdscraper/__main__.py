#!/usr/bin/env python3

import argparse
import requests
from iok.meta import KnowledgeGraph
from .md_scrape import match_hierarchy, match_line

# returns the graph for debugging
def main(link: str, path: str) -> KnowledgeGraph:

    if link:
        f = requests.get(link)
        text = f.text
    elif path:
        with open(path, "r") as f:
            text = f.read()
    else:
        raise Exception("Need either Link or Path")

    textlines = text.splitlines()

    scopes = []
    graph = KnowledgeGraph(0)
    for line in textlines:
        match = match_hierarchy(line)
        scopes = match_line(match, line, scopes, graph)

    return graph


parser = argparse.ArgumentParser()
src = parser.add_mutually_exclusive_group(required=True)
src.add_argument("--link", type=str, help="Link to raw MD file")
src.add_argument("--path", type=str, help="Path to local MD file")
parser.add_argument("--out", type=str, help="Path of the graph output file")
args = parser.parse_args()


g = main(args.link, args.path)

ret = g.write_to_json(args.out)
if not args.out:  # didn't write to file, so print
    print(ret)
