#!/usr/bin/env python3

from iok import AwesomeClient, KnowledgeGraph

import networkx as nx

try:
    g = KnowledgeGraph()
    g.add_topic('math', 'mathematics is everything')
    g.add_topic('cs', 'computation and stuff')
    g.add_topic('lightning', 'l2 stuff')
    g.add_topic('bitcoin', 'p2p cash system', parents=['math', 'cs'], children=['lightning'])
    g.write_to_file()
    print(g.get_graph().nodes)
except:
    print("Graph already exists...")

a = AwesomeClient(g)
a.build_map()
print(a.build_str)
print("printed preivew...")
a.write_to_file()

g.write_graph()