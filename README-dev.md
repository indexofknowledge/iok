# Developing on IoK

This is a separate markdown file since we want to display the awesome-list as the main README.

## Notes

* IoK node schema isn't too complicated now, so don't want to implement JSON encoders and classes. We can do everything in python dicts for now. Also want to allow anyone to invent their own schemas and up to the client to decide how to display (incorrect or fail safe up to them)
* Want to store meta schema somewhere though for ease of dev

## Python backend 

We write a simple parser that constructs a networkx digraph (optionally via existing graph `graph.json`) and provides methods for manipulation and serialization of the graph.

## Web graph

Once Flask webserver is up, visit `/graph`. A static version generated via nx to image is at `/graph/static` naturally.

## Awesome list

Basically linearizes the IoK digraph onto markdown.


## Constribution client

TBD: Simple web client that authenticates via GitHub and allows users to contribute. Contribution would consist of plugging in necessary fields (e.g. resource name, type, reasoning), which then generates a pull request from `user/iok` to `rustielin/iok`.

For now via Flask:

```
# create and activate venv 
python3 -m venv venv
source venv/bin/activate

# install everything
pip install -r requirements.txt

# run flask
export FLASK_APP=app.py
flask run
```

## Datastores 

TBD: IPFS via OrbitDB, where we use document mode to store `graph.json` versions directly under the same DB hash. Execute this via CI on Github, and have default web graph clients point to that IPFS hash via gateway.