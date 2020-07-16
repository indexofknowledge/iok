# IoK Raw Data Validator

Implements IoK data format spec and validates given files. The idea is to be separate from the main IoK (meta) library, so that we can use this as a CLI tool, and also independently implement the spec.

## Copy of spec

Top level shape of graph roughly follows cytoscape graph format in JSON, and should be:

```
elements: {
    nodes: [],
    edges: [],
}
```

Node data is checked into IPFS and get their own [CID](https://docs.ipfs.io/concepts/content-addressing/#identifier-formats)

```
nodes: [
  {
    data: {
      id: <cid_as_str>,
      name: (if node_type == topic),
      node_type: ...,
      resource_type: (if node_type == resource),
      data: CID
    }
  }
]
```

Node's data ('s data) contains some simple fields, and fields may be empty depending on the node's resource type:

```
{
    text: ...,
    link: ...,
}
```

Edges are simple and should contain data:

```
edges: [
    {
        data: {
            id: uuid,
            source: source_node_id,
            target: target_node_id,
        }
    }
]
```
