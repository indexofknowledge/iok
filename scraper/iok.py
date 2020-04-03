#!/usr/bin/env python3

import json
import random
import string
import re
import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
from enum import IntEnum
# from logging import logging 
import logging

# TODO: make this multiline nicer
DESCRIPTION = "The Decentralized Index of Knowledge (DIoK) is a curated collection of resources for blockchain, grouped by topic and ordered by pedagogical dependency. We store data as a graph, allowing programmatic creation of front-ends such as interactive graph visualizations as well as awesome-lists."

TRAVIS = '[![Build Status](https://travis-ci.com/rustielin/iok.svg?branch=master)](https://travis-ci.com/rustielin/iok)'

class NodeType(IntEnum):
    TOPIC = 1
    RESOURCE = 2

class ResourceType(IntEnum):
    DESCRIPTION = 1
    ARTICLE = 2
    VIDEO = 3
    PAPER = 4

LINK_TYPES = [ResourceType.ARTICLE, ResourceType.VIDEO, ResourceType.PAPER]

class KnowledgeGraph:

    def __init__(self, filename, debug=False):
        logging.info("Trying to read graph from {}".format(filename))
        self.graph = nx.DiGraph()
        self.read_from_file(filename)
        # create new one if not


    def write_graph(self, filename):
        """For debugging mostly, write graph to png"""
        nx.draw(self.graph, with_labels=True)
        plt.savefig(filename)


    def read_from_file(self, filename):
        """Reads graph from JSON file in data link format"""
        with open(filename, 'r') as f:
            elements = json.load(f)
        nodes = elements['nodes']
        edges = elements['edges']
        for node in nodes:
            dat = node['data']
            data = None
            resource_type = None
            name = None
            if 'data' in dat:
                data = dat['data']
            if 'resource_type' in dat:
                resource_type = dat['resource_type']
            if 'name' in dat:
                name = dat['name']

            self.add_knowledge_node(dat['id'], NodeType(dat['node_type']), name=name, data=data, resource_type=resource_type)

        for edge in edges:
            dat = edge['data']
            self.graph.add_edge(dat['source'], dat['target'])


    def add_knowledge_node(self, id: str, node_type: NodeType, name=None, data=None, resource_type: ResourceType=None):
        self.graph.add_node(id)
        node = self.graph.nodes[id]
        node['node_type'] = node_type
        if resource_type:
            node['resource_type'] = resource_type
        if data:
            node['data'] = data
        if name:
            node['name'] = name


    def get_graph(self):
        return self.graph


class AwesomeClient():
    """Makes an awesome-list from the given graph"""

    def __init__(self, graph: KnowledgeGraph):
        self.knowledge = graph

    def build_map(self):
        """Parses the graph and builds a map"""
        logging.debug("Building map")
        dic = {}  # XXX: throw it into dict so we can sort it later??
        for id in list(reversed(list(nx.topological_sort(self.knowledge.graph)))):
            node = self.knowledge.graph.nodes[id]
            name = node['name']
            if node['node_type'] == NodeType.TOPIC: # if sorted, topics always before resources
                dic[name] = {'name': name}  # XXX: a placeholder
                dic[name]['papers'] = []
                dic[name]['videos'] = []
                dic[name]['articles'] = []
                dic[name]['descriptions'] = []
                logging.debug(f"Added topic to map: {name}")
            else:  # NodeType.RESOURCE
                # put it in parents
                logging.debug("Adding resource {}".format(name))
                for p_id in self.knowledge.graph.successors(id):
                    parent = self.knowledge.graph.nodes[p_id]['name']
                    logging.debug(f"{name} has parent {parent}")
                    dat = node['data']  # XXX: only desc for now
                    # articles, papers,
                    t = node['resource_type']
                    logging.debug("Building map for type {}".format(t))

                    if t == ResourceType.PAPER:
                        dic[parent]['papers'].append(dat)
                        logging.debug("Adding paper")
                    elif t == ResourceType.VIDEO:
                        dic[parent]['videos'].append(dat)
                        logging.debug("Adding video")
                    elif t == ResourceType.ARTICLE:
                        dic[parent]['articles'].append(dat)
                        logging.debug("Adding articles")
                    elif t == ResourceType.DESCRIPTION:
                        dic[parent]['descriptions'].append(dat)
                        logging.debug("Adding description")


        self.mindmap = dic
        return dic

    def get_link(self, dat):
        # TODO: get separate alt text
        text = dat['text']
        link = dat['link']
        return f'* [{text}]({link})\n' 

    def escape_toc_link_txt(self, s):
        """spaces in toc link need to be escaped, among others"""
        return re.sub(r"\s+", '%20', s)

    def get_toc_link(self, title):
        """Generate link that references title on the same doc"""
        return f'* [{title}](#{self.escape_toc_link_txt(title)})\n'

    def get_h(self, s: str, level=1):
        """Generates markdown string for header of variable level"""
        return '#' * level + ' ' + s + '\n\n'

    def get_s(self, s: str):
        """Generate markdown string for single line of text"""
        return f'{s}\n\n'

    def build_str(self):
        head = ''
        head += self.get_h('Index of Knowledge')
        head += self.get_s(TRAVIS)
        head += self.get_s(DESCRIPTION)

        s = ''
        for key in self.mindmap:
            s += self.get_h(key, level=2)
            if len(self.mindmap[key]['descriptions']):
                s += self.get_h('Description', level=3)
                for x in self.mindmap[key]['descriptions']:
                    s += self.get_s(x)
            if len(self.mindmap[key]['papers']):
                s += self.get_h('Papers', level=3)
                for x in self.mindmap[key]['papers']:
                    s += self.get_link(x)
                    s += '\n'
            if len(self.mindmap[key]['articles']):
                s += self.get_h('Articles', level=3)
                for x in self.mindmap[key]['articles']:
                    s += self.get_link(x)
                    s += '\n'
            if len(self.mindmap[key]['videos']):
                s += self.get_h('Videos', level=3)
                for x in self.mindmap[key]['videos']:
                    s += self.get_link(x)
                    s += '\n'

        # TODO: write a ToC
        toc = ''
        toc += self.get_h('Table of Contents', level=2)
        for key in self.mindmap:
            toc += self.get_toc_link(key)
        toc += '\n'

        return head + toc + s

    def write_to_file(self, filename):
        """Writes awesome-list"""
        with open(filename, 'w') as f:
            f.write(self.build_str())

    # def read_from_file(self, filename=AWESOME_FILE):
    #     """Reads graph from JSON file in data link format"""
    #     with open(filename, 'r') as f:
    #         dat = json.load(f)
    #     self.graph = json_graph.node_link_graph(dat)

    # def write_to_file(self, filename=AWESOME_FILE):
    #     """Writes awesome-list"""
    #     # XXX: random to avoid collision for now, until read impl
    #     filename += random_string(5)
    #     with open(filename, 'w') as f:
    #         json.dump(data, f)