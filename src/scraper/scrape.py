#!/usr/bin/env python

import requests
import sys
from iok.meta import KnowledgeGraph, AwesomeClient


def run_scrape(link: str, out_file: str, debug: bool = False) -> None:
    r = requests.get(link)
    graph = r.json()

    g = KnowledgeGraph(obj=graph, debug=debug)

    a = AwesomeClient(g)
    a.build_map()

    if out_file:
        a.write_to_file(out_file)
    else:
        print(a.build_str())
