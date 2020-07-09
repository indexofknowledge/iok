#!/usr/bin/env python3

import json
import random
import string
from typing import Optional
import re
import hashlib
import uuid
import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph

# from logging import logging
import logging
from .types import NodeType, ResourceType, RESOURCE_HEADINGS, LINK_TYPES
from .constants import DESCRIPTION, TRAVIS


class KnowledgeGraph:
    def __init__(self, filename="", obj={}, debug=False):
        if filename:
            logging.info(f"Trying to read graph from file {filename}")
            self.graph = nx.DiGraph()
            self.read_from_file(filename)
        elif obj:
            logging.info("Trying to read graph from obj")
            self.graph = nx.DiGraph()
            self.read_from_json_obj(obj)
        else:
            self.graph = nx.DiGraph()

    def write_graph(self, filename):
        """For debugging mostly, write graph to png"""
        nx.draw(self.graph, with_labels=True)
        plt.savefig(filename)

    def write_to_json(self, filename=""):
        """
        Write the graph to JSON file according to cytoscape format.
        Returns if no filename provided.
        """
        dat = json_graph.node_link_data(self.graph)
        # wrap everything in a "data" field
        dat["edges"] = dat.pop("links")
        for x in dat["edges"]:
            x["data"] = x.copy()
            del x["source"]
            del x["target"]
            del x["id"]

        for x in dat["nodes"]:
            x["data"] = x.copy()
            if x["node_type"] == NodeType.RESOURCE:
                del x["resource_type"]
            del x["name"]
            del x["node_type"]
            del x["id"]

        dat["elements"] = {"nodes": dat["nodes"], "edges": dat["edges"]}
        del dat["nodes"]
        del dat["edges"]

        if filename:
            with open(filename, "w") as f:
                json.dump(dat, f)
        else:
            return dat

    def read_from_json_obj(self, obj):
        """Reads graph from JSON object"""
        elements = obj["elements"]
        nodes = elements["nodes"]
        edges = elements["edges"]
        for node in nodes:
            dat = node["data"]
            data = None
            resource_type = None
            name = None
            if "data" in dat:
                data = dat["data"]
            if "resource_type" in dat:
                resource_type = dat["resource_type"]
            if "name" in dat:
                name = dat["name"]

            self._add_knowledge_node(
                NodeType(dat["node_type"]),
                id=dat["id"],
                name=name,
                data=data,
                resource_type=resource_type,
            )

        for edge in edges:
            dat = edge["data"]
            self.graph.add_edge(dat["source"], dat["target"])

    def read_from_file(self, filename):
        """Reads graph from JSON file in data link format"""
        with open(filename, "r") as f:
            elements = json.load(f)
            self.read_from_json_obj(elements)

    def add_edge(self, src_id: str, dst_id: str, id: str = ""):
        if not id:
            m = hashlib.sha256()
            m.update(src_id.encode())
            m.update(dst_id.encode())
            id = m.hexdigest()
        self.graph.add_edge(src_id, dst_id, id=id)
        return id

    def add_topic_node(self, name, id: str = "") -> str:
        if not id:
            m = hashlib.sha256()
            m.update(name.encode())
            id = m.hexdigest()
        return self._add_knowledge_node(NodeType.TOPIC, id=id, name=name)

    def add_resource_node(
        self,
        text: str,
        link: str = "",
        id: str = "",
        resource_type: Optional[ResourceType] = ResourceType.DESCRIPTION,
    ) -> str:
        if not id:
            m = hashlib.sha256()
            m.update(text.encode())
            m.update(link.encode())
            id = m.hexdigest()
        data = {"text": text, "link": link}
        return self._add_knowledge_node(
            NodeType.RESOURCE, id=id, data=data, resource_type=resource_type
        )

    def _add_knowledge_node(
        self,
        node_type: NodeType,
        id: str = "",
        name: str = None,
        data: str = None,
        resource_type: Optional[ResourceType] = None,
    ) -> str:
        self.graph.add_node(id)

        if node_type == NodeType.TOPIC:
            self.graph.add_node(id, name=name, node_type=node_type)
        elif node_type == NodeType.RESOURCE:
            self.graph.add_node(
                id,
                name=f"res-{id[:7]}",  # XXX: get rid of this eventually
                data=data,
                resource_type=resource_type,
                node_type=node_type,
            )

        return id

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
        for id in list(reversed(list(nx.topological_sort(self.knowledge.graph)))):
            node = self.knowledge.graph.nodes[id]
            name = node["name"]
            if (
                node["node_type"] == NodeType.TOPIC
            ):  # if sorted, topics always before resources
                dic[name] = {"name": name}  # XXX: a placeholder
                dic[name][ResourceType.PAPER] = []
                dic[name][ResourceType.VIDEO] = []
                dic[name][ResourceType.ARTICLE] = []
                dic[name][ResourceType.DESCRIPTION] = []
                logging.debug(f"Added topic to map: {name}")
            else:  # NodeType.RESOURCE
                # put it in parents
                logging.debug("Adding resource {}".format(name))
                for p_id in self.knowledge.graph.successors(id):
                    parent = self.knowledge.graph.nodes[p_id]["name"]
                    logging.debug(f"{name} has parent {parent}")
                    dat = node["data"]  # XXX: only desc for now
                    # articles, papers,
                    t = node["resource_type"]
                    logging.debug("Building map for type {}".format(t))

                    if t == ResourceType.PAPER:
                        dic[parent][ResourceType.PAPER].append(dat)
                        logging.debug("Adding paper")
                    elif t == ResourceType.VIDEO:
                        dic[parent][ResourceType.VIDEO].append(dat)
                        logging.debug("Adding video")
                    elif t == ResourceType.ARTICLE:
                        dic[parent][ResourceType.ARTICLE].append(dat)
                        logging.debug("Adding articles")
                    elif t == ResourceType.DESCRIPTION:
                        dic[parent][ResourceType.DESCRIPTION].append(dat)
                        logging.debug("Adding description")

        self.mindmap = dic
        return dic

    def get_link(self, dat):
        # TODO: get separate alt text
        text = dat["text"]
        link = dat["link"]
        return f"* [{text}]({link})\n"

    def get_nodedata(self, dat):
        """Formats a node's data.
        Like get_s or get_link, but handles any type of node data."""
        if isinstance(dat, str):
            return self.get_s(dat)
        if "link" in dat:
            return self.get_link(dat)
        return self.get_s(dat["text"])

    def escape_toc_link_txt(self, s):
        """spaces in toc link need to be escaped, among others"""
        return re.sub(r"\s+", "%20", s)

    def get_toc_link(self, title):
        """Generate link that references title on the same doc"""
        return f"* [{title}](#{self.escape_toc_link_txt(title)})\n"

    def get_h(self, s: str, level=1):
        """Generates markdown string for header of variable level"""
        return "#" * level + " " + s + "\n\n"

    def get_s(self, s: str):
        """Generate markdown string for single line of text"""
        return f"{s}\n\n"

    def build_str(self):
        """Create a markdown representing the whole iok."""
        head = ""
        head += self.get_h("Index of Knowledge")
        head += self.get_s(TRAVIS)
        head += self.get_s(DESCRIPTION)

        s = ""
        for key in self.mindmap:
            s += self.get_h(key, level=2)
            s += self.build_node_str(self.mindmap[key])

        # TODO: write a ToC
        toc = ""
        toc += self.get_h("Table of Contents", level=2)
        for key in self.mindmap:
            toc += self.get_toc_link(key)
        toc += "\n"

        return head + toc + s

    def build_node_str(self, node):
        """Create a markdown representing a node on the iok."""
        s = ""
        for hkey, hname in RESOURCE_HEADINGS.items():
            if len(node[hkey]):
                s += self.get_h(hname, level=3)
                for x in node[hkey]:
                    s += self.get_nodedata(x)
        return s

    def write_to_file(self, filename):
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
