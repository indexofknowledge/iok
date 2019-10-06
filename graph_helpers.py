#!/usr/bin/env python3

import json
import random
import string
import logging
import logging.handlers
import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
from enum import IntEnum

####################################  LOGGING #################################### 

LOG_FILENAME = 'graph_output.log'
logger = logging.getLogger("graph-logger")
logger.setLevel(logging.DEBUG)

# Add the log message handler to the logger
handler = logging.handlers.RotatingFileHandler(
              LOG_FILENAME, maxBytes=20, backupCount=5)

logger.addHandler(handler)

####################################  HELPER #################################### 

def random_string(string_length):
    """Generate a random string with the combination of lowercase and uppercase letters """
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(string_length))


####################################  CONFIG #################################### 

FILENAME = 'graph.json'
AWESOME_FILE = 'awesome-blockchain.md'

####################################  CLASSES #################################### 

class NodeType(IntEnum):
    TOPIC = 1
    RESOURCE = 2

class ResourceType(IntEnum):
    DESCRIPTION = 1
    ARTICLE = 2
    VIDEO = 3
    PAPER = 4

class KnowledgeGraph:

    def __init__(self, filename=FILENAME):
        # get from file 
        try:
            logger.info("Trying to read graph from {}".format(filename))
            self.read_from_file(filename)
        except Exception as e:
            logger.info("Failed to read from {}".format(filename))
            logger.debug(e)
            self.graph = nx.DiGraph()
            logger.info("Creating a new graph")
        # create new one if not

    def write_to_file(self, filename=FILENAME):
        """Writes graph to JSON in data link format"""
        # TODO: probably include a way to backup
        data = json_graph.node_link_data(self.graph)
        with open(filename, 'w') as f:
            json.dump(data, f)

    def read_from_file(self, filename=FILENAME):
        """Reads graph from JSON file in data link format"""
        with open(filename, 'r') as f:
            dat = json.load(f)
        self.graph = json_graph.node_link_graph(dat)

    def __topic_exists(self, name):
        if name in self.graph.nodes:
            return True
        return False

    def __assert_topic_exists(self, name, exists=True, err=""):
        """Simple wrapper to assert if topic by name exists or not"""
        if exists:
            assert self.__topic_exists(name), err
        else:
            assert not self.__topic_exists(name), err

    def __gen_resource_name(self, name: str):
        """Generate a resource name randomly. Don't want to be able to get it directly"""
        return name + '-' + random_string(10)

    def add_description_by_name(self, name: str, desc: str):
        """Adds a description node by name of parent"""
        self.__assert_topic_exists(name, 
           "Cannot delete, topic {} does not exist".format(name))
        desc_name = self.__gen_resource_name(name)
        self.graph.add_node(desc_name)
        self.graph.nodes[desc_name]['text'] = desc
        self.graph.nodes[desc_name]['node_type'] = NodeType.RESOURCE
        self.graph.nodes[desc_name]['resource_type'] = ResourceType.DESCRIPTION
        self.graph.add_edge(name, desc_name)

    def add_topic(self, name: str, desc: str, parents=[], children=[]):
        # TODO: decide whether parents/children are topics or resources or both
        self.__assert_topic_exists(name, exists=False,
            err="Cannot add, topic {} already exists".format(name))
        self.graph.add_node(name)
        self.graph.nodes[name]['node_type'] = NodeType.TOPIC
        for parent in parents:
            self.__assert_topic_exists(name,
                "Parent {} does not exist".format(parent))
            self.graph.add_edge(parent, name)
        for child in children:
            self.__assert_topic_exists(name,
                "Child {} does not exist".format(child))
            self.graph.add_edge(name, child)
        self.add_description_by_name(name, desc)

    def delete_topic(self, name: str):
        self.__assert_topic_exists(name, False, 
           "Cannot delete, topic {} does not exist".format(name))
        for edge in self.graph.edges(name):
            self.graph.remove_edge(edge)
        self.graph.remove_node(name)

    def get_graph(self):
        return self.graph


class AwesomeClient():
    """Makes an awesome-list from the given graph"""

    def __init__(self, graph: KnowledgeGraph):
        self.knowledge = graph

    def build_map(self):
        """Parses the graph and builds a map"""
        """TODO: we should build this in topological order"""
        dic = {}  # XXX: throw it into dict so we can sort it later??
        for name in nx.topological_sort(self.knowledge.graph):
            node = self.knowledge.graph.nodes[name]
            if node['node_type'] == NodeType.TOPIC: # if sorted, topics always before resources
                dic[name] = {'name': name}  # XXX: a placeholder
            else:  # NodeType.RESOURCE
                # put it in parents
                for parent in self.knowledge.graph.predecessors(name):
                    dic[parent]['description'] = node['text']  # XXX: only desc for now

        self.mindmap = dic
        return dic
    
    def build_str(self):
        s = ''
        for key in self.mindmap:
            s += '# {}\n\n'.format(key)
            s += '{}\n\n'.format(self.mindmap[key]['description'])
        return s

    def write_to_file(self, filename=AWESOME_FILE):
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

####################################  AD-HOC TESTING #################################### 

try:
    g = KnowledgeGraph()
    g.add_topic('math', 'mathematics is everything')
    g.add_topic('cs', 'computation and stuff')
    g.add_topic('lightning', 'l2 stuff')
    g.add_topic('bitcoin', 'p2p cash system', parents=['math', 'cs'], children=['lightning'])
    print(g.get_graph().nodes)
except:
    print("Graph already exists...")

a = AwesomeClient(g)
a.build_map()
print(a.build_str)
print("printed preivew...")
a.write_to_file()

nx.draw(g.graph, with_labels=True)
plt.savefig("iok.png")
