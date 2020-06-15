const sha256 = require('js-sha256'); // eslint-disable-line

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
    if (match !== TEXT) {
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
    hash.update(this.node.name + (JSON.stringify(this.data) || ''));
    this.node.id = this.id = hash.hex(); // eslint-disable-line

    // set level for comparing hierarchy
    this.level = (match === TOPIC) ? line.match(TOPIC)[1].length : Infinity;
  }

  nodeName() {
    if (!this.data) return this.line;
    return this.data.text.slice(0, 10);
  }
  /* eslint-disable */
  nodeData() {
    if (this.match === TOPIC) return;
    const link = this.line.match(/(?:__|[*#])|\[(.*?)\]\((.*?)\)/);
    if (link && link[0] && link[1]) {
      return { text: link[1], link: link[2] };
    }
    return { text: this.line, link: '' };
  }
  /* eslint-enable */
}

// Match the given line with the regex hierarchy, returning the most specific match
function matchHierarchy(line) {
  return HIERARCHY.find((h) => h.test(line));
}

// Update the scopes and add a new node to graph
function updateScopes(newScope, scopes, graph) {
  // eslint-disable-next-line
  let scopesCpy = [...scopes];

  graph.nodes.push({ data: newScope.node });
  // console.log("Adding ", new_scope.node, "\n")

  if (scopesCpy.length) {
    const targetId = scopesCpy[scopesCpy.length - 1].id;
    // console.log("Adding edge ", new_scope.id, " AND ", target_id, "\n")

    const hash = sha256.create();
    hash.update(newScope.id + targetId);

    graph.edges.push(
      {
        data: {
          source: newScope.id,
          target: targetId,
          id: hash.hex(),
        }
      },
    );
  }
  scopesCpy.push(newScope);
  return scopesCpy;
}

/**
 * Based on the current scope (list of regex by increasing specificity),
 * add the current matched line to the graph by either branching or continuing the current branch
 */
function matchLine(newScope, scopes, graph) {
  // eslint-disable-next-line
  let scopesCpy = [...scopes];

  if (!newScope.match) {
    return scopesCpy;
  }

  if (!scopesCpy.length) {
    return updateScopes(newScope, scopes, graph);
  }

  const endScope = scopesCpy[scopesCpy.length - 1];

  if (newScope.level > endScope.level) {
    return updateScopes(newScope, scopes, graph);
  }
  scopesCpy.pop();
  return matchLine(newScope, scopesCpy, graph);
}

// given a string, returns the graph in IOK format
function createGraph(text) {
  const textlines = text.split('\n');
  let scopes = [];

  // eslint-disable-next-line
  let graph = {
    nodes: [],
    edges: [],
  };

  // eslint-disable-next-line
  for (const line of textlines) {
    const match = matchHierarchy(line);
    const newScope = new Scope(match, line);
    scopes = matchLine(newScope, scopes, graph);
  }
  return graph;
}

export function graphFromUrl(link) {
  const text = fetch(link).then((response) => response.text());
  const g = createGraph(text);
  // console.log(JSON.stringify(g, null, 2));
  return g;
}

export function graphFromText(text) {
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
