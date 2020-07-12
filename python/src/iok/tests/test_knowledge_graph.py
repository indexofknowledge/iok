from iok.meta import KnowledgeGraph
from iok.types import ResourceType, NodeType


def test_init() -> None:
    """KnowledgeGraph loads empty by default"""
    kg = KnowledgeGraph()
    g = kg.get_graph()
    assert len(g.nodes) == 0
    assert len(g.edges) == 0


def test_add_topic_node() -> None:
    kg = KnowledgeGraph()
    node_id = kg.add_topic_node("Bitcoin")
    assert node_id
    node_id2 = kg.add_topic_node("Bifcoin")
    assert node_id2
    assert node_id2 != node_id

    # force a collision
    node_id3 = kg.add_topic_node("Bitcoin CLONE", id=node_id)
    assert node_id == node_id3


def test_add_resource_node() -> None:
    kg = KnowledgeGraph()
    resource_id = kg.add_resource_node(
        "Bitcoin desc", resource_type=ResourceType.DESCRIPTION
    )
    assert resource_id

    resource_id2 = kg.add_resource_node(
        "Bitcoin link", link="http://fakelink.bitcoin", resource_type=ResourceType.PAPER
    )
    assert resource_id2
    assert resource_id != resource_id2


def test_write_to_json() -> None:
    kg = KnowledgeGraph()
    node_name = "bitcoin"
    node_id = kg.add_topic_node(node_name)

    node_name2 = "bitcoin2"
    node_id2 = kg.add_topic_node(node_name2)

    resource = "bitcoin description"
    resource_id = kg.add_resource_node(resource)

    edge_id = kg.add_edge(node_id, node_id2)
    j = kg.write_to_json()
    print(j)  # if pytest fails, we'll see the output

    assert len(j["nodes"]) == 3
    assert len(j["edges"]) == 1

    assert [
        x
        for x in j["nodes"]
        if x["data"]["node_type"] == NodeType.TOPIC
        and x["data"]["name"] == node_name
        and x["data"]["id"] == node_id
    ]
    assert [
        x
        for x in j["nodes"]
        if x["data"]["node_type"] == NodeType.TOPIC
        and x["data"]["name"] == node_name2
        and x["data"]["id"] == node_id2
    ]
    assert [x for x in j["nodes"] if x["data"]["node_type"] == NodeType.RESOURCE]
    assert [
        x
        for x in j["edges"]
        if x["data"]["source"] == node_id
        and x["data"]["target"] == node_id2
        and x["data"]["id"] == edge_id
    ]
