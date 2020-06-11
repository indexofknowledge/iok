// import { sha256 } from 'js-sha256';
const sha256 = require('js-sha256');

// regex for ordering lines based on hierarchy 
const TOPIC = /^(#+)\s/;
const TEXT = /^[A-Za-z]/;
const RESOURCES = [TEXT, /^[*-]/];
const HIERARCHY = [...RESOURCES, TOPIC];

class Scope {
  constructor(match, line) {
    // console.log('Creating new scope', match, line)
    if (!match) return;
    this.match = match;
    this.line = line.trim();

    // create node
    if (match != TEXT) {
      this.line = line.replace(match, '').trim();
    }
    const isTopic = (match === TOPIC);
    this.data = this.nodeData();
    this.node = {
      name: this.nodeName(),
      node_type: isTopic ? 1 : 2,
    };
    if (this.data) this.node.data = this.data;
    if (!isTopic) this.node.resource_type = this.data.link ? 2 : 1;

    // create id
    const hash = sha256.create();
    hash.update(JSON.stringify(this.node));
    this.node.id = this.id = hash.hex();

    // set level for comparing hierarchy
    this.level = (match === TOPIC) ? line.match(TOPIC)[1].length : Infinity;
  }

  nodeName() {
    if (!this.data) return this.line;
    return this.data.text.slice(0, 10);
  }

  nodeData() {
    if (this.match === TOPIC) return;
    let link = this.line.match(/(?:__|[*#])|\[(.*?)\]\((.*?)\)/);
    if (link && link[0] && link[1]) {
      return { text: link[1], link: link[2] }
    } else {
      return { text: this.line, link: '' };
    }
  }
}

// Match the given line with the regex hierarchy, returning the most specific match    
function matchHierarchy(line) {
  return HIERARCHY.find(h => h.test(line));
}

// Update the scopes and add a new node to graph
function updateScopes(new_scope, scopes, graph) {
  let scopes_cpy = [...scopes];

  graph.nodes.push(new_scope.node);
  // console.log("Adding ", new_scope.node, "\n")

  if (scopes_cpy.length) {
    let target_id = scopes_cpy[scopes_cpy.length - 1].id;
    // console.log("Adding edge ", new_scope.id, " AND ", target_id, "\n")

    const hash = sha256.create();
    hash.update(new_scope.id + target_id);

    graph.edges.push(
      {
        source: new_scope.id,
        target: target_id,
        id: hash.hex(),
      },
    );
  }
  scopes_cpy.push(new_scope);
  return scopes_cpy;
}

/**
 * Based on the current scope (list of regex by increasing specificity), 
 * add the current matched line to the graph by either branching or continuing the current branch 
 */
function matchLine(new_scope, scopes, graph) {
  let scopes_cpy = [...scopes];

  if (!new_scope.match) {
    return scopes_cpy;
  }

  if (!scopes_cpy.length) {
    return updateScopes(new_scope, scopes, graph);
  }

  const end_scope = scopes_cpy[scopes_cpy.length - 1];

  if (new_scope.level > end_scope.level) {
    return updateScopes(new_scope, scopes, graph);
  } else {
    scopes_cpy.pop()
    return matchLine(new_scope, scopes_cpy, graph);
  }
}

//given a string, returns the graph in IOK format
function createGraph(text) {
  let textlines = text.split('\n');
  let scopes = [];

  let graph = {
    nodes: [],
    edges: [],
  };

  for (const line of textlines) {
    const match = matchHierarchy(line);
    const new_scope = new Scope(match, line);
    scopes = matchLine(new_scope, scopes, graph);
  }
  return graph;
}

export function graph_from_url(link) {
  const text = fetch(link).then(response => response.text());
  const g = createGraph(text);
  // console.log(JSON.stringify(g, null, 2));
  return g;
}

export function graph_from_text(text) {
  const g = createGraph(text);
  // console.log(JSON.stringify(g, null, 2));
  return g;
}

// FOR TESTING IN CMD LINE; replace ./graph.md with md file
// if (require && require.main === module) {
//     const fs = require('fs');
//     var text = fs.readFileSync('./graph.md', 'utf8')
//     console.log(text)
//     if (text) {
//         let g = create_graph(text)
//         console.log(JSON.stringify(g, null, 2))
//     }
// }
