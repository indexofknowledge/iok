import json
import cid
from iok.meta import NodeType


class CidException(Exception):
    pass


def check_shape(data):
    assert "elements" in data
    assert "nodes" in data.get("elements")
    assert "edges" in data.get("elements")


def check_node_id(node_data):
    id = node_data.get("id")
    try:
        node_cid = cid.from_string(id)
    except:
        raise CidException(f"Invalid CID: {id}! Please refer to spec.")

    assert node_cid.version == 1
    assert node_cid.codec == "dag-cbor"


def check_node_data_data(node_data_data):
    assert "text" in node_data_data
    assert "link" in node_data_data


def check_node_data(node_data):
    assert "id" in node_data
    check_node_id(node_data)
    assert "node_type" in node_data

    if NodeType(node_data.get("node_type")) == NodeType.RESOURCE:
        assert "resource_type" in node_data
        assert "data" in node_data
        check_node_data_data(node_data.get("data"))


def check_edge_data(edge_data, graph_data):
    assert "id" in edge_data
    assert "source" in edge_data
    assert "target" in edge_data

    assert node_id_exists(edge_data.get("source"), graph_data.get("nodes"))
    assert node_id_exists(edge_data.get("target"), graph_data.get("nodes"))


def node_id_exists(id, nodes):
    return any([id == node.get("data").get("id") for node in nodes])


def run_validator(file, debug=False):
    with open(file, "r") as f:
        data = json.load(f)

    check_shape(data)
    graph_data = data.get("elements")
    nodes = data.get("elements").get("nodes")
    edges = data.get("elements").get("edges")
    for node in nodes:
        node_data = node.get("data")
        check_node_data(node_data)

    for edge in edges:
        edge_data = edge.get("data")
        check_edge_data(edge_data, graph_data)
