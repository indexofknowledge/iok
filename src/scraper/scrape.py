#!/usr/bin/env python

import requests
import argparse
import sys
from iok.meta import KnowledgeGraph, AwesomeClient


parser = argparse.ArgumentParser()
parser.add_argument(
    "--link", type=str, required=True, help="Link to IoK JSON graph file"
)
parser.add_argument("--out", type=str, required=True, help="Path of the output file")
parser.add_argument("--debug", action="store_true")

args = parser.parse_args()

r = requests.get(args.link)
graph = r.json()

g = KnowledgeGraph(obj=graph, debug=args.debug)

a = AwesomeClient(g)
a.build_map()
a.write_to_file(args.out)
