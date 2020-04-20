#!/usr/bin/env python3

import networkx as nx
from networkx.readwrite import json_graph
import re
import requests
import matplotlib.pyplot as plt
from hashlib import sha256
import json
import sys
import uuid
from networkx.readwrite import json_graph

# configs
JSON_FILE = "graph.json"
GRAPH_FILE = "graph.png"

# regex for ordering lines based on hierarchy
HIERARCHY = [r"^[*-]", r"^[A-Za-z]", r"^###", r"^##", r"^#"]
TOPICS = {r"^#", r"^##", r"^###"}
RESOURCES = {r"^[A-Za-z]", r"^[*-]"}

class Scope:
    def __init__(self, match: str, line: str):
        self.match = match
        self.node = self.build_node_obj(line, match)

    def get_id(self):
        return self.node["data"]["id"]

    def get_name(self):
        return self.node["data"]["name"]

    def get_link(self, line):
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
            cleaned_line = re.sub(match, '', line).strip()
        if match in TOPICS:
            dat = {"name": cleaned_line, "node_type": 1}
        elif match in RESOURCES:
            link_if_link = self.get_link(cleaned_line)
            if link_if_link:
                text, link = link_if_link
                # TODO: borrow enums from scraper/iok.py, into utils module
                # TODO: do something about not inferring resource_type 2 for links...
                dat = {"data": {"text": text, "link": link}, "node_type": 2, "resource_type": 2}
            else:
                dat = {"data": {"text": cleaned_line, "link": ""}, "node_type": 2, "resource_type": 1}

        dats = json.dumps(dat).encode('utf-8')
        dat["id"] = sha256(dats).hexdigest()
        return {"data": dat}


def cmp_hierarchy(s1: str, s2: str) -> int:
    assert s1 in HIERARCHY and s2 in HIERARCHY
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


# returns the graph for debugging
def main(link: str) -> nx.DiGraph:

    f = requests.get(link)
    text = f.text
    textlines = text.splitlines()

    """
    Maintain a list of regex "scopes" based on hierarchy.
    All matches of higher specificity becomes nodes with edges pointing to matches 
    of lower specificity. Upon encountering lower specificity, pop from the end, and start
    a new branch.

        example markdown:
            # Bitcoin
            Bitcoin is a cryptocurrency
            ## Links
            * [text](link)

        scopes per line executed:
            [H1]
            [H1, DESC]
            [H1, H2]
            [H1, H2, BULLET]

        graph representation per line executed:
            H1
            
            H1 <-- DESC
            
            H1 <-- DESC
            ^--H2

            H1 <-- DESC
            ^-- H2 <-- BULLET

    """

    def update_scopes(match: str, line: str, scopes: list, graph: nx.DiGraph) -> list:
        """
        Update the scopes and add a new node to graph
        """
        scopes_cpy = scopes.copy()

        # build the node
        new_scope = Scope(match, line)
        id = new_scope.get_id()

        # add the node to graph
        graph.add_node(id)
        node = graph.nodes[id]
        for k, v in new_scope.node.items():
            node[k] = v

        # connect
        if scopes_cpy:
            graph.add_edge(id, scopes_cpy[-1].get_id())

        scopes_cpy.append(new_scope)
        return scopes_cpy


    def match_line(match: str, line: str, scopes: list, graph: nx.DiGraph) -> list:
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
        end_match, end_node = end_scope.match, end_scope.node

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

    scopes = []
    graph = nx.DiGraph()
    for line in textlines:
        match = match_hierarchy(line)
        scopes = match_line(match, line, scopes, graph)

    return graph

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Missing link argument")
        print("Expected: md_scrape <raw md link>")
        print("Example: md_scrape https://raw.githubusercontent.com/rustielin/iok/master/README.md")
        exit(1)

    link = sys.argv[1]
    g = main(link)

    # draw to file for debugging
    nx.draw(g, with_labels=True)
    plt.savefig(GRAPH_FILE)

    # write to json file too
    dat = json_graph.node_link_data(g)
    # making it a format cytoscape likes...
    dat["edges"] = dat.pop("links")
    # wrap everything in a "data" key...
    for x in dat["edges"]:
        x["data"] = x.copy()
        x["data"]["id"] = uuid.uuid1().hex
        del x["source"]
        del x["target"]
    with open(JSON_FILE, 'w') as f:
        json.dump(dat, f)    
