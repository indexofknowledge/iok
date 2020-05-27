#!/usr/bin/env python3

import json
import random
import string
import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
from enum import IntEnum

# from logging import logging
import logging
from iok_helpers import *

# TODO: make this multiline nicer
DESCRIPTION = "The Decentralized Index of Knowledge (DIoK) is a curated collection of resources for blockchain, grouped by topic and ordered by pedagogical dependency. We store data as a graph, allowing programmatic creation of front-ends such as interactive graph visualizations as well as awesome-lists. Users can contribute to the DIoK by using a web-based tool which will fork the IoK, generate corresponding graph data, and make a PR to sync to our copy. For now we’re bootstrapping off of GitHub, but the goal is to integrate with IPFS via a graph database plugin and also layer a reputation system on top to allow users to rate resources. Developers see [dev docs](./DEV.md)"


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
    def __init__(self, filename=FILENAME, debug=False):
        # get from file
        if debug:
            logging.debug("Creating new graph in debug mode...")
            self.graph = nx.DiGraph()
            return

        try:
            logging.info("Trying to read graph from {}".format(filename))
            self.read_from_file(filename)
        except Exception as e:
            logging.info("Failed to read from {}".format(filename))
            logging.debug(e)
            self.graph = nx.DiGraph()
            logging.info("Creating a new graph")
        # create new one if not

    def write_to_file(self, filename=FILENAME):
        """Writes graph to JSON in data link format"""
        # TODO: probably include a way to backup
        data = json_graph.node_link_data(self.graph)
        with open(filename, "w") as f:
            json.dump(data, f)

    def write_graph(self, filename=IMG_FILE):
        """For debugging mostly, write graph to png"""
        nx.draw(self.graph, with_labels=True)
        plt.savefig(filename)

    def read_from_file(self, filename=FILENAME):
        """Reads graph from JSON file in data link format"""
        with open(filename, "r") as f:
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
        return name + "-" + random_string(10)

    def add_description(self, name: str, desc: str):
        """Adds a description node by name of parent"""
        self.__assert_topic_exists(
            name, "Cannot add, topic {} does not exist".format(name)
        )
        desc_name = self.__gen_resource_name(name)
        self.add_knowledge_node(
            desc_name, NodeType.RESOURCE, desc, ResourceType.DESCRIPTION
        )
        self.graph.add_edge(desc_name, name)

    def add_link(self, name, text, link, type: ResourceType):
        """Adds a link by name of parent"""
        self.__assert_topic_exists(
            name, "Cannot add, topic {} does not exist".format(name)
        )
        link_name = self.__gen_resource_name(name)
        dat = {"text": text, "link": link}
        self.add_knowledge_node(link_name, NodeType.RESOURCE, dat, type)
        self.graph.add_edge(link_name, name)

    def add_knowledge_node(
        self,
        name: str,
        node_type: NodeType,
        data=None,
        resource_type: ResourceType = None,
    ):
        self.graph.add_node(name)
        node = self.graph.nodes[name]
        node["node_type"] = node_type
        if resource_type:
            node["resource_type"] = resource_type
        if data:
            node["data"] = data

    def add_topic(self, name: str, desc: str, parents=[], children=[]):
        # TODO: decide whether parents/children are topics or resources or both
        self.__assert_topic_exists(
            name, exists=False, err="Cannot add, topic {} already exists".format(name)
        )
        self.add_knowledge_node(name, NodeType.TOPIC)
        for parent in parents:
            self.__assert_topic_exists(name, "Parent {} does not exist".format(parent))
            self.graph.add_edge(parent, name)
        for child in children:
            self.__assert_topic_exists(name, "Child {} does not exist".format(child))
            self.graph.add_edge(name, child)
        self.add_description(name, desc)

    def delete_topic(self, name: str):
        self.__assert_topic_exists(
            name, False, "Cannot delete, topic {} does not exist".format(name)
        )
        for edge in self.graph.edges(name):
            self.graph.remove_edge(edge)
        self.graph.remove_node(name)

    def get_graph(self):
        return self.graph


class AwesomeClient:
    """Makes an awesome-list from the given graph"""

    def __init__(self, graph: KnowledgeGraph):
        self.knowledge = graph

    def build_map(self):
        """Parses the graph and builds a map"""
        logging.debug("Building map")
        dic = {}  # XXX: throw it into dict so we can sort it later??
        for name in list(reversed(list(nx.topological_sort(self.knowledge.graph)))):
            node = self.knowledge.graph.nodes[name]
            if (
                node["node_type"] == NodeType.TOPIC
            ):  # if sorted, topics always before resources
                dic[name] = {"name": name}  # XXX: a placeholder
                dic[name]["papers"] = []
                dic[name]["videos"] = []
                dic[name]["articles"] = []
                dic[name]["descriptions"] = []
                logging.debug(f"Added topic to map: {name}")
            else:  # NodeType.RESOURCE
                # put it in parents
                logging.debug("Adding resource {}".format(name))
                for parent in self.knowledge.graph.successors(name):
                    logging.debug(f"{name} has parent {parent}")
                    dat = node["data"]  # XXX: only desc for now
                    # articles, papers,
                    t = node["resource_type"]
                    logging.debug("Building map for type {}".format(t))

                    if t == ResourceType.PAPER:
                        dic[parent]["papers"].append(dat)
                        logging.debug("Adding paper")
                    elif t == ResourceType.VIDEO:
                        dic[parent]["videos"].append(dat)
                        logging.debug("Adding video")
                    elif t == ResourceType.ARTICLE:
                        dic[parent]["articles"].append(dat)
                        logging.debug("Adding articles")
                    elif t == ResourceType.DESCRIPTION:
                        dic[parent]["descriptions"].append(dat)
                        logging.debug("Adding description")

        self.mindmap = dic
        return dic

    def get_link(self, dat):
        # TODO: get separate alt text
        text = dat["text"]
        link = dat["link"]
        return f"* [{text}]({link})\n"

    def get_toc_link(self, title):
        """Generate link that references title on the same doc"""
        return f"* [{title}](#{title})\n"

    def get_h(self, s: str, level=1):
        """Generates markdown string for header of variable level"""
        return "#" * level + " " + s + "\n\n"

    def get_s(self, s: str):
        """Generate markdown string for single line of text"""
        return f"{s}\n\n"

    def build_str(self):
        head = ""
        head += self.get_h("Index of Knowledge")
        head += self.get_s(DESCRIPTION)

        s = ""
        for key in self.mindmap:
            s += self.get_h(key, level=2)
            s += self.get_h("Description", level=3)
            for x in self.mindmap[key]["descriptions"]:
                s += self.get_s(x)
            s += self.get_h("Papers", level=3)
            for x in self.mindmap[key]["papers"]:
                s += self.get_link(x)
                s += "\n"
            s += self.get_h("Articles", level=3)
            for x in self.mindmap[key]["articles"]:
                s += self.get_link(x)
                s += "\n"
            s += self.get_h("Videos", level=3)
            for x in self.mindmap[key]["videos"]:
                s += self.get_link(x)
                s += "\n"

        # TODO: write a ToC
        toc = ""
        toc += self.get_h("Table of Contents", level=2)
        for key in self.mindmap:
            toc += self.get_toc_link(key)
        toc += "\n"

        return head + toc + s

    def write_to_file(self, filename=AWESOME_FILE):
        """Writes awesome-list"""
        with open(filename, "w") as f:
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
