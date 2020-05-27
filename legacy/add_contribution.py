#!/usr/bin/env python

from iok import AwesomeClient, KnowledgeGraph, NodeType, ResourceType

# adds a contribution to README.md with the proper format
try:
    g = KnowledgeGraph()
except:
    raise Exception("Failed to load existing graph from file")

print("Just need some metadata...")
node_type = -1
while node_type not in NodeType.__members__.values():
    try:
        node_type = int(input("NodeType? TOPIC (1) RESOURCE (2): "))
    except:
        print("Please give me an int :(")

if node_type == NodeType.TOPIC:
    topic = input("Topic name? ")
    desc = input("Topic description? ")
    parents = input("Parents (space delim)? ")
    parents = parents.split()
    children = input("Children (space delim)? ")
    children = children.split()
    g.add_topic(topic, desc, parents, children)
elif node_type == NodeType.RESOURCE:

    resource_type = -1
    while resource_type not in ResourceType.__members__.values():
        try:
            resource_type = int(
                input("ResourceType? DESCRIPTION (1) ARTICLE (2) VIDEO (3) PAPER (4)")
            )
        except:
            print("Please give me an int :(")

    topic = input("Associated topic name? ")

    if resource_type == ResourceType.DESCRIPTION:
        desc = input("Topic description? ")
        g.add_description(topic, desc)
    else:
        title = input("Resource title? ")
        link = input("Resource link? ")
        g.add_link(topic, title, link, resource_type)

# write graph json
g.write_to_file()

# write static nx graph
g.write_graph()

# build meta map/graph and write to awesome file
a = AwesomeClient(g)
a.build_map()
a.write_to_file()
