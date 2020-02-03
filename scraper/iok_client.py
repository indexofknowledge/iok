#!/usr/bin/env python3
#
# Grabs graph json, plugs it into a KnowledgeGraph, and prints via AwesomeClient
#

from iok import KnowledgeGraph, AwesomeClient

import networkx as nx
import argparse
import os

parser = argparse.ArgumentParser(description='IoK client arg parser')
parser.add_argument('--debug', action='store_true')

args = parser.parse_args()

g = KnowledgeGraph(os.getenv('GRAPH_FILE'), debug=args.debug)
g.write_graph(os.getenv('IMG_FILE')) # for debugging mostly
# print(g.get_graph().nodes)

a = AwesomeClient(g)
a.build_map()
# print(a.build_str)
# print("printed preivew...")
a.write_to_file(os.getenv('AWESOME_FILE'))