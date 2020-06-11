// import { sha256 } from 'js-sha256';
const sha256 = require('js-sha256')

// configs
JSON_FILE = "graph.json"
GRAPH_FILE = "graph.png"

// regex for ordering lines based on hierarchy
TOPIC = /^(#+)\s/
TEXT = /^[A-Za-z]/
RESOURCES = [TEXT, /^[*-]/]
HIERARCHY = [...RESOURCES, TOPIC]

class Scope {
    constructor(match, line) {
        this.match = match
        this.line = line.trim()
        if (match != TEXT) {
            this.line = line.replace(match, '').trim()
        }
        const isTopic = (match === TOPIC)
        this.data = this.node_data()
        this.node = {
            name: this.node_name(),
            node_type: isTopic ? 1 : 2,
            data: this.data
        }
        if (!isTopic) this.node.resource_type = this.data.link ? 2 : 1
        const hash = sha256.create();
        hash.update(JSON.stringify(this.node));
        this.node.id = this.id = hash.hex();
        this.level = (match === TOPIC) ? line.match(TOPIC)[1].length : Infinity;
    }

    node_name() {
        if (!this.data) return this.line;
        return this.data.text.slice(0, 10);
    }

    node_data() {
        if (this.match === TOPIC) return
        let link = this.line.match(/(?:__|[*#])|\[(.*?)\]\((.*?)\)/)
        if (link && link[0] && link[1]) {
            return { text: link[1], link: link[2] }
        } else {
            return { text: this.line }
        }
    }
}

function match_hierarchy(line) {
    // Match the given line with the regex hierarchy, returning the most specific match
    return HIERARCHY.find(h => h.test(line));
}

function update_scopes(new_scope, scopes, graph) {
    // Update the scopes and add a new node to graph
    let scopes_cpy = [...scopes]

    // add the node to graph
    graph.nodes.push(new_scope.node)
    if (scopes_cpy.length) {
        let target_id = scopes_cpy[scopes_cpy.length - 1].get_id();

        //create hash for edge id
        const hash = sha256.create();
        hash.update(new_scope.id + target_id);

        graph.edges.push(
            {
                source: new_scope.id,
                target: target_id,
                id: hash.hex(),
            }
        )
    }

    scopes_cpy.push(new_scope)
    return scopes_cpy
}



function match_line(new_scope, scopes, graph) {
    // Based on the current scope (list of regex by increasing specificity), add the current matched line
    // to the graph by either branching or continuing the current branch 
    scopes_cpy = [...scopes]

    if (!match) {
        return scopes_cpy
    }

    if (!scopes_cpy.length) {
        return update_scopes(new_scope, scopes, graph)
    }

    let end_scope = scopes_cpy[scopes_cpy.length - 1]

    if (new_scope.level < end_scope.level) {
        return update_scopes(new_scope, scopes, graph)
    } else {
        scopes_cpy.pop()
        return match_line(new_scope, scopes_cpy, graph)
    }
}


/**
 * Fetches a url and returns the graph
 * in IOK format.
 */
function create_graph(text) {
    // TODO: fetchy stuff
    console.log("THIS IS TEXT", text)
    let textlines = text.split('\n')

    let scopes = []
    // TODO graph stuff
    let graph = {
        nodes: [],
        edges: []
    }

    for (line of textlines) {
        match = match_hierarchy(line)
        let new_scope = new Scope(match, line)
        scopes = match_line(new_scope, scopes, graph)
    }
    return graph
}

function graph_from_url(link) {
    let text = fetch(link).then(response => response.text())
    let g = create_graph(text)
    console.log(JSON.stringify(g, null, 2))
    return g
}

function graph_from_text(text) {
    let g = create_graph(text)
    console.log(JSON.stringify(g, null, 2))
    return g
}

if (1) {
    const fs = require('fs');
    let graph = fs.readFile('./graph.md')
    console.log("DATA", graph)
    if (graph) {
        console.log("GRAPH", graph)
        let g = create_graph(graph)
        console.log(JSON.stringify(g, null, 2))
    }

}