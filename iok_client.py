#!/usr/bin/env python3

from iok import AwesomeClient, KnowledgeGraph, ResourceType

import networkx as nx
import argparse

parser = argparse.ArgumentParser(description='IoK client arg parser')
parser.add_argument('--debug', action='store_true')

args = parser.parse_args()

try:
    g = KnowledgeGraph(debug=args.debug)
    g.add_topic('math', 'mathematics is everything')
    g.add_topic('cs', 'computation and stuff')
    g.add_topic('lightning', 'l2 stuff')
    g.add_topic('bitcoin', 'p2p cash system', parents=['math', 'cs'], children=['lightning'])
    g.add_link('bitcoin', 'Bitcoin whitepaper', 'https://bitcoin.org/bitcoin.pdf', ResourceType.PAPER)
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