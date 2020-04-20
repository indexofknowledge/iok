// eslint-disable-line
/* eslint-disable no-console */
/* eslint-disable no-alert */

// Mostly imported from old IoKv3...
// Ugly code inbound

const TAG = 'listen';

// some ugly state ugh...
const cy = null;
let eh = null;
let drawOn = false;
let layout = null;
let lastRoot = null; // dummy
let hasCycle = false;

/**
 *
 * @param {*} cy
 * @param {*} data including node_type, id, and name
 */
// eslint-disable-next-line no-shadow
export const addNode = (cy, data) => {
  try {
    return cy.add({
      group: 'nodes',
      data,
    });
  } catch (err) {
    alert('Failed to add node. Check for ID collisions');
    return null;
  }
};

/**
 * Extract the json for the cy instance but only with nodes and edges
 * Dealing with the entire cy instance is too heavy and also comes with unintended
 * side effects (e.g. node highlighting and styles)
 * @param {*} cy
 */
// eslint-disable-next-line no-shadow
export const getNodesEdgesJson = (cy) => {
  const j = cy.json();
  const { nodes } = j.elements;
  const { edges } = j.elements;
  for (let i = 0; i < nodes.length; i += 1) {
    nodes[i] = { data: nodes[i].data };
  }
  for (let k = 0; k < edges.length; k += 1) {
    edges[k] = { data: edges[k].data };
  }
  return { nodes, edges };
};

// eslint-disable-next-line no-shadow
export const getExportableJson = (cy) => {
  const j = getNodesEdgesJson(cy);
  const obj = { elements: j };
  obj.style = cy.style;
  return obj;
};

// eslint-disable-next-line no-shadow
export const registerEdgeHandles = (cy) => {
  eh = cy.edgehandles({
    preview: true,
    noEdgeEventsInDraw: true,
    snap: true,
    handleNodes: 'node', // fake this for now
  });
  eh.disableDrawMode();
  eh.disable();
  // eslint-disable-line
  // eslint-disable-next-line no-unused-vars
  cy.on('ehcomplete', (event, sourceNode, targetNode, addedEles) => {
    // let { position } = event;
    console.log(TAG, 'Added edge...');
    console.log(TAG, 'source:', sourceNode);
    console.log(TAG, 'target:', targetNode);
    console.log(TAG, 'eles:', cy.elements().length);
    // console.log(TAG, cy.nodes().length)
  });
};

export const toggleDrawMode = () => {
  if (drawOn) {
    eh.disableDrawMode();
    eh.disable();
    drawOn = false;
  } else {
    eh.enable();
    eh.enableDrawMode();
    drawOn = true;
  }
};

// returns registered cy
export const getCy = () => cy;

// TODO: offer alternatives..?
// export const highlightNodeDepsOnClick = (evt) => {
//     // console.log('Node tapped')
//     const node = evt.target;
//     setHighlighted(node);
//     setNodeData(node);
//     drawDependency(cy, node);
// }

// eslint-disable-next-line no-shadow
export const recenterCy = (cy) => {
  cy.fit();
};

// eslint-disable-next-line no-shadow
export const regroupCy = (cy, cola = false) => {
  if (layout) {
    layout.stop();
  }
  layout = cy.layout({
    name: cola ? 'cola' : 'dagre',
    animate: true,
    padding: 50,
    animationDuration: 300,
    nodeDimensionsIncludeLabels: true,
  });
  layout.run();
  return new Promise(() => { // give it some time
    recenterCy(cy);
  });
};

// eslint-disable-next-line no-shadow
export const toggleMeta = (cy) => {
  // console.log("TOGGLING META")
  const resources = cy.nodes('[node_type > 1]');
  if (resources.length === 0) {
    // console.log("No resources found, can't toggle meta")
    return;
  }
  let replacementStyle = 'none';
  if (resources[0].style('display') === 'none') {
    replacementStyle = 'element';
  }
  for (let i = 0; i < resources.length; i += 1) {
    resources[i].style('display', replacementStyle);
  }
};

const removeHighlighted = (el) => {
  el.removeClass('highlighted');
  el.removeClass('altHighlighted'); // impl once we have cycle detection
};

const unselect = async (el) => {
  el.removeClass('selected');
  el.unselect();
};

const setHighlighted = async (el) => {
  el.addClass('highlighted');
};

const setAltHighlighted = async (el) => {
  el.addClass('altHighlighted');
};

// eslint-disable-next-line no-shadow
const clearHighlighted = (cy) => {
  cy.nodes().forEach(removeHighlighted);
  cy.edges().forEach(removeHighlighted);
  cy.nodes().forEach(unselect);
  cy.edges().forEach(unselect);
};

const notRootFilter = (el) => el !== lastRoot;

// recursively get dependencies
const calcDepNaive = (root, depe) => {
  if (root === null) {
    return cy.collection();
  }

  let dep = depe.add(root);
  const parents = root.incomers();
  let numNewParents = 0;
  for (let i = 0; i < parents.length; i += 1) {
    const p = parents[i];
    if (!dep.contains(p)) {
      dep = dep.add(calcDepNaive(p, dep));
      numNewParents += dep.length;
    }
  }
  if (numNewParents < parents.length - 1) {
    hasCycle = true;
    alert('Oh no! We have a dependency cycle...');
  }

  if (numNewParents === 0) {
    return dep;
  }
  return dep;
};

// eslint-disable-next-line no-shadow
const drawDependency = (cy, node) => {
  // console.log("drawDependency")
  clearHighlighted(cy);
  lastRoot = node;
  hasCycle = false;
  const graph = calcDepNaive(node, cy.collection());
  // console.log("deps...")
  // console.log(graph)
  if (hasCycle) {
    graph.filter(notRootFilter).forEach(setAltHighlighted);
  } else {
    graph.filter(notRootFilter).forEach(setHighlighted);
  }
  node.addClass('selected');
};

// simple wrapper to allow users to swap out what happens on click
// eslint-disable-next-line no-shadow
export const registerNodeTap = (cy, callback) => {
  cy.on('tap', 'node', (evt) => {
    const node = evt.target;
    setHighlighted(node);
    callback(node);
    drawDependency(cy, node);
  });
};

export const validURL = (str) => {
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
        + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
        + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
        + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
        + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
};

/**
 * Set node data to HMTL
 * TODO: get cy neighbors
 * TODO: CLEAN THIS UP!!!
 * @param {*} node
 */
// const setNodeData = (node) => {

//     // write some basic name and ID
//     if (node.data('name')) {
//         document.getElementById('nodetitle').innerText = node.data('name')
//     }
//     document.getElementById('nodeid').innerText = node.data('id')


//     const ulNodeLinks = document.getElementById('nodelinks');
//     const ulNodeDeps = document.getElementById('nodedeps')
//     const ulNodeDescs = document.getElementById('nodedescs')
//     const nodeSubtitle = document.getElementById('nodesubtitle')
//     ulNodeLinks.innerHTML = ''; // dirty wiping
//     ulNodeDeps.innerHTML = '';
//     ulNodeDescs.innerHTML = '';
//     nodeSubtitle.innerHTML = '';
//     const li = null;
//     const depText = null;
//     const a = null;
//     const data = null;
//     const linkText = null;

//     // get each dependency for traversal
//     const neighbors = node.incomers((el) => el.isNode())

//     // XXX: HACK!! If it's a resource, just make it it's own neighbor so we can display
//     if (node.data('node_type') !== 1) {
//         neighbors = [node]
//         nodeSubtitle.innerHTML = 'NOTE: Resource node. Displaying own contents';
//     }

//     for (const i = 0; i < neighbors.length; i++) {
//         const dataObj = neighbors[i].data()
//         if (dataObj.node_type === 1) { // topic is dep
//             li = document.createElement('li');
//             depText = document.createTextNode(dataObj.name)
//             li.appendChild(depText)
//             ulNodeDeps.appendChild(li)
//         } else if (dataObj.node_type === 2) { // resource
//             data = neighbors[i].data().data
//             if (dataObj.resource_type === 1) { // desc
//                 li = document.createElement('li')
//                 li.appendChild(document.createTextNode(data))
//                 ulNodeDescs.appendChild(li)
//             } else { // link type
//                 li = document.createElement('li');
//                 a = document.createElement('a');
//                 linkText = document.createTextNode(data.text);
//                 a.appendChild(linkText);
//                 a.title = data.text;
//                 a.href = data.link;
//                 li.appendChild(a);
//                 ulNodeLinks.appendChild(li);
//             }
//         }
//     }
// }
