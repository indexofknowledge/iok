#!/usr/bin/env python3

import networkx as nx
from iok.meta import KnowledgeGraph
from iok.types import ResourceType, NodeType
import re
import requests
import matplotlib.pyplot as plt
from hashlib import sha256
import json
import uuid
from networkx.readwrite import json_graph

# regex for ordering lines based on hierarchy
HIERARCHY = [r"^[*-]", r"^[A-Za-z]", r"^###", r"^##", r"^#"]
TOPICS = {r"^#", r"^##", r"^###"}
RESOURCES = {r"^[A-Za-z]", r"^[*-]"}


class Scope:
    def __init__(self, match: str, line: str, graph: KnowledgeGraph):
        self.match = match
        self.graph = graph
        self.build_node_obj(line, match)

    def get_id(self):
        return self.id

    def _get_name(self):
        """XXX: for debug only, gets the name of the underlying node"""
        return self.graph.get_graph().nodes[self.id]["name"]

    def _get_data(self):
        """XXX: for debug only, gets the data of the underlying node"""
        return self.graph.get_graph().nodes[self.id]["data"]

    def _get_link(self, line):
        """Returns link text and link of parsed markdown link, if regex matched"""
        match = re.search(r"(?:__|[*#])|\[(.*?)\]\((.*?)\)", line)
        if match:
            groups = match.groups()
            return groups[0], groups[1]
        return None

    def build_node_obj(self, line: str, match: str) -> dict:
        """
        Given a line from markdown, build a representative obj
        TODO: standardize the obj format and how to hash (issue #5)
        """
        dat = {}
        # don't want to remove the first char of a description :)
        cleaned_line = line
        if match != r"^[A-Za-z]":
            cleaned_line = re.sub(match, "", line).strip()
        m = sha256()
        if match in TOPICS:
            node_id = self.graph.add_topic_node(cleaned_line)
        elif match in RESOURCES:
            link_if_link = self._get_link(cleaned_line)
            if link_if_link:
                text, link = link_if_link
                # TODO: do something about not inferring resource_type 2 for links...
                node_id = self.graph.add_resource_node(
                    text, link=link, resource_type=ResourceType.ARTICLE
                )
            else:
                node_id = self.graph.add_resource_node(
                    cleaned_line, resource_type=ResourceType.DESCRIPTION
                )

        self.id = node_id


def cmp_hierarchy(s1: str, s2: str) -> int:
    assert s1 in HIERARCHY and s2 in HIERARCHY

    # all resources are equal
    if s1 in RESOURCES and s2 in RESOURCES:
        return 0

    i, i1, i2 = 0, 0, 0
    for h in HIERARCHY:
        if s1 == h:
            i1 = i

        if s2 == h:
            i2 = i

        i += 1
    return i1 - i2


def match_hierarchy(line: str) -> str:
    """
    Match the given line with the regex hierarchy, returning the most specific match
    """
    for h in HIERARCHY:
        x = re.search(h, line)
        if x:
            return h
    return ""


def update_scopes(match: str, line: str, scopes: list, graph: KnowledgeGraph) -> list:
    """
    Update the scopes and add a new node to graph
    """
    scopes_cpy = scopes.copy()

    # build the node and add to graph
    new_scope = Scope(match, line, graph)
    id = new_scope.get_id()

    # connect
    if scopes_cpy:
        graph.add_edge(id, scopes_cpy[-1].get_id())

    scopes_cpy.append(new_scope)
    return scopes_cpy


def match_line(match: str, line: str, scopes: list, graph: KnowledgeGraph) -> list:
    """
    Based on the current scope (list of regex by increasing specificity), add the current matched line
    to the graph by either branching or continuing the current branch 
    """
    if scopes is None:
        return []
    scopes_cpy = scopes.copy()
    if not match:
        return scopes_cpy
    if not scopes_cpy:
        return update_scopes(match, line, scopes, graph)

    # peek the end
    end_scope = scopes_cpy[-1]
    end_match = end_scope.match

    # determine whether to continue or branch
    cmped = cmp_hierarchy(match, end_match)
    if cmped < 0:
        return update_scopes(match, line, scopes, graph)
    else:
        try:
            scopes_cpy.pop()
            return match_line(match, line, scopes_cpy, graph)
        except IndexError:
            return scopes_cpy


def graphFromText(text: str):
  textlines = text.splitlines()
  scopes = []
  graph = KnowledgeGraph(0)
  for line in textlines:
      match = match_hierarchy(line)
      scopes = match_line(match, line, scopes, graph)
  return graph

# returns the graph for debugging
def main(link: str) -> KnowledgeGraph:
    f = requests.get(link)
    text = f.text
    return graphFromText(text)



    
