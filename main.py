import os
from flask import Flask, render_template, request, url_for, send_file, redirect, flash
from iok import AwesomeClient, KnowledgeGraph, NodeType, ResourceType
from networkx.readwrite import json_graph
import networkx as nx
import matplotlib.pyplot as plt
from flask_github import GitHub
from dotenv import load_dotenv
from io import BytesIO

# fix crash
plt.switch_backend('Agg')

# load .env
load_dotenv()

# hack
os.environ['SERVER_SOFTWARE'] = 'Google App Engine/'  
 
app = Flask(__name__)

# load in
try:
    app.config['GITHUB_CLIENT_ID'] = os.environ['GITHUB_CLIENT_ID']
    app.config['GITHUB_CLIENT_SECRET'] = os.environ['GITHUB_CLIENT_SECRET']
except Exception as e:
    raise e

github = GitHub(app)


GRAPH = None

def register_graph():
    global GRAPH
    if not GRAPH:
        try: 
            GRAPH = KnowledgeGraph()
        except:
            raise Exception("Failed to load existing graph from file")

@app.route('/')
def index():
    return redirect(url_for('get_graph'))
    
@app.route('/login')
def login():
    return github.authorize()

@app.route('/contribute')
@github.authorized_handler
def contribute(oauth_token):
    if oauth_token is None:
        return redirect(url_for('login'))
    return render_template('iok_contrib.html')

@app.route('/graph')
def get_graph():
    if GRAPH:
        return render_template('iok.html', graph=GRAPH.graph)
    else:
        return render_template('iok.html')

@app.route('/graph/data')
def get_graph_data():
    return send_file('static/graph.json')

@app.route('/graph/static')
def get_static():
    return send_file('static/iok.png')

def create_img_stream():
    nx.draw(GRAPH.graph, with_labels=True)
    img = BytesIO() # file-like object for the image
    plt.savefig(img) # save the image to the stream
    img.seek(0) # writing moved the cursor to the end of the file, reset
    plt.clf() # clear pyplot
    return img

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
        return send_file(create_img_stream(), mimetype='image/png')

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

        return send_file(create_img_stream(), mimetype='image/png')

    # projectpath = request.form['projectFilepath']
    # your code
    # return a response
    return f"wow fail :( {node_type} == {NodeType.TOPIC} ? {node_type == NodeType.TOPIC}"


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='0.0.0.0', port=8081, debug=True)