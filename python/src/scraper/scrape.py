import requests
import sys
from iok.meta import KnowledgeGraph, AwesomeClient


def run_scraper(link="", file="", out="", debug=False):
    if link:
        r = requests.get(link)
        graph = r.json()
        g = KnowledgeGraph(obj=graph, debug=debug)
    else:
        g = KnowledgeGraph(filename=file, debug=debug)

    a = AwesomeClient(g)
    a.build_map()

    if out:
        a.write_to_file(out)
    else:
        print(a.build_str())
