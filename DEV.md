# Developing on IoK

This is a separate markdown file since we want to display the awesome-list as the main README.

## Notes

* IoK node schema isn't too complicated now, so don't want to implement JSON encoders and classes. We can do everything in python dicts for now. Also want to allow anyone to invent their own schemas and up to the client to decide how to display (incorrect or fail safe up to them)
* Want to store meta schema somewhere though for ease of dev

## Python backend 

We write a simple parser that constructs a networkx digraph (optionally via existing graph `graph.json`) and provides methods for manipulation and serialization of the graph.

## Web graph

We try to serve everything statically, so all we need to set up for webdev is to open `web/` in a supported (modern) browser and watch the magic happen. For debugging purposes, the main `iok.js` script will attempt to fetch data locally from `graph.json`. To comply with CORS policy, we need to serve this file via webserver. The easiest way to do this would be:

```
python3 -m http.server
```

## Awesome list

Basically linearizes the IoK digraph onto markdown.


## Constribution client

TBD: Simple web client that authenticates via GitHub and allows users to contribute. Contribution would consist of plugging in necessary fields (e.g. resource name, type, reasoning), which then generates a pull request from `user/iok` to `rustielin/iok`.

## Datastores 

TBD: IPFS via OrbitDB, where we use document mode to store `graph.json` versions directly under the same DB hash. Execute this via CI on Github, and have default web graph clients point to that IPFS hash via gateway.