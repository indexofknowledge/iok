from flask import Flask, render_template, request, url_for, send_file
from iok import AwesomeClient, KnowledgeGraph, NodeType, ResourceType
from networkx.readwrite import json_graph
 
app = Flask(__name__)

GRAPH = None

def register_graph():
    try: 
        global GRAPH
        GRAPH = KnowledgeGraph()
    except:
        raise Exception("Failed to load existing graph from file")
 
@app.route('/')
def index():
    return "Hello World!"

@app.route('/contribute')
def contribute():
    return render_template('iok_contrib.html')

@app.route('/graph')
def get_graph():
    return render_template('iok.html')

@app.route('/graph/data')
def get_graph_data():
    return send_file('static/graph.json')

@app.route('/graph/static')
def get_static():
    return send_file('static/iok.png')

@app.route('/handle_data', methods=['POST'])
def handle_data():
    register_graph()
    assert GRAPH
    node_type = int(request.form['nodeType'])
    if node_type == NodeType.TOPIC:
        name = request.form['topicName']
        assert name
        desc = request.form['topicDescription']
        assert desc
        parents = request.form['parents']
        parents = parents.split()
        children = request.form['children']
        children = children.split()
        GRAPH.add_topic(name, desc, parents, children)
        GRAPH.write_to_file()
        return "Added node"

    elif node_type == NodeType.RESOURCE:
        name = request.form['resourceName']
        resource_type = int(request.form['resourceType'])
        if resource_type == ResourceType.DESCRIPTION:
            desc = request.form['resourceDescription']
            GRAPH.add_description(name, desc)
        else:  # assume no attacks haha
            title = request.form['resourceTitle']
            link = request.form['resourceLink']
            GRAPH.add_link(name, title, link, resource_type)

        GRAPH.write_to_file()
        return "Added resource"

    # projectpath = request.form['projectFilepath']
    # your code
    # return a response
    return f"wow fail :( {node_type} == {NodeType.TOPIC} ? {node_type == NodeType.TOPIC}"