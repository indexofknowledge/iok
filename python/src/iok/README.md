# IoK Python Library

Main IoK python utils library. 

* `constants` contains some constants for generating Awesome Lists
* `meta` contains meta-objects used by the IoK to represent Awesome Lists, Graphs, etc
* `types` contains some reusable types
  

## Graph Data Format

```
{
    ...
    nodes: [
        data: {
            id: node_type == TOPIC ? sha256(data.name) : sha256(data.text || data.link),
            data: { # if node_type == RESOURCE
                text: <node_text>,
                link: <node_link>
            },
            name: <node_name>, # if node_type == TOPIC
            node_type: <node_type>,
            resource_type: <resource_type>, # if node_type == RESOURCE
            meta: ...,
        }
    ],
    edges: [
        data: {
            id: sha256(source || target),
            source: <source_node_id>,
            target: <target_node_id>,
            meta: ...,
        }
    ]
}
```