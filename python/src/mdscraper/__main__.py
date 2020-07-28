#!/usr/bin/env python3

import argparse
import requests
from iok.meta import KnowledgeGraph
from .md_scrape import match_hierarchy, match_line

# returns the graph for debugging
def main(link: str) -> KnowledgeGraph:

    f = requests.get(link)
    text = f.text
    textlines = text.splitlines()

    scopes = []
    graph = KnowledgeGraph(0)
    for line in textlines:
        match = match_hierarchy(line)
        scopes = match_line(match, line, scopes, graph)

    return graph


parser = argparse.ArgumentParser()
parser.add_argument("--link", type=str, required=True, help="Link to raw MD file")
parser.add_argument("--out", type=str, help="Path of the graph output file")
args = parser.parse_args()


g = main(args.link)

ret = g.write_to_json(args.out)
if not args.out:  # didn't write to file, so print
    print(ret)
