// Mostly imported from old IoKv3...
// Ugly code inbound

var TAG = 'listen'

// some ugly state ugh...
var cy = null
var eh = null
var drawOn = false

/**
 * 
 * @param {*} cy 
 * @param {*} data including node_type, id, and name
 */
export var addNode = (cy, data) => {
    cy.add({
        group: "nodes",
        data: data
    })
}

export var registerEdgeHandles = (cy) => {
    eh = cy.edgehandles({
      preview: true,
      noEdgeEventsInDraw: true,
      snap: true,
      handleNodes: 'node' // fake this for now
    });
    eh.disableDrawMode()
    eh.disable()
    cy.on('ehcomplete', (event, sourceNode, targetNode, addedEles) => {
      // let { position } = event;
      console.log(TAG, "Added edge...")
      console.log(TAG, "source:", sourceNode)
      console.log(TAG, "target:", targetNode)
      console.log(TAG, "eles:", cy.elements().length)
      // console.log(TAG, cy.nodes().length)
    });
}

export var toggleDrawMode = () => {
    if (drawOn) {
        eh.disableDrawMode()
        eh.disable()
        drawOn = false
    } else {
        eh.enable()
        eh.enableDrawMode()
        drawOn = true
    }
}

// returns registered cy
export var getCy = () => {
    return cy
}

// simple wrapper to allow users to swap out what happens on click
export var registerNodeTap = (cy) => {
    cy.on('tap', 'node', (evt) => {
        var node = evt.target;
        setHighlighted(node);
        setNodeData(node);
        drawDependency(cy, node);
    })
}

// TODO: offer alternatives..?
export var highlightNodeDepsOnClick = (evt) => {
    // console.log('Node tapped')
    var node = evt.target;
    setHighlighted(node);
    setNodeData(node);
    drawDependency(cy, node);
}

export var recenterCy = (cy) => {
    cy.fit()
}

export var regroupCy = (cy) => {
    var layout = cy.layout({
        name: 'dagre',
        animate: true,
        padding: 10
    });
    layout.run();
    return new Promise(() => { // give it some time
        recenterCy(cy)
    })
}


export var toggleMeta = (cy) => {
    // console.log("TOGGLING META")
    var resources = cy.nodes('[node_type > 1]')
    if (resources.length === 0) {
        // console.log("No resources found, can't toggle meta")
        return
    }
    var replacementStyle = "none"
    if (resources[0].style("display") === "none") {
        replacementStyle = "element"
    } 
    for (var i = 0; i < resources.length; i++) {
        resources[i].style("display", replacementStyle)
    }
}

var removeHighlighted = ( el ) => {
    el.removeClass('highlighted');
    el.removeClass('altHighlighted');  // impl once we have cycle detection 
}

var unselect = async ( el ) => {
    el.removeClass('selected');
    el.unselect();
}

var setHighlighted = async ( el ) => {
    el.addClass('highlighted');
}

var setAltHighlighted = async ( el ) => {
    el.addClass('altHighlighted');
}

var clearHighlighted = (cy) => {
    cy.nodes().forEach(removeHighlighted);
    cy.edges().forEach(removeHighlighted);
    cy.nodes().forEach(unselect);
    cy.edges().forEach(unselect);
}

var notRootFilter = ( el ) => {
    return el !== lastRoot;
}

var lastRoot = null; // dummy
var drawDependency = (cy, node) => {
    // console.log("drawDependency")
    clearHighlighted(cy);
    lastRoot = node;
    hasCycle = false;
    var graph = calcDepNaive(node, cy.collection());
    // console.log("deps...")
    // console.log(graph)
    if (hasCycle) {
        graph.filter(notRootFilter).forEach(setAltHighlighted);
    } else {
        graph.filter(notRootFilter).forEach(setHighlighted);
    }
    node.addClass('selected');
}

// recursively get dependencies
var hasCycle = false; 
var calcDepNaive = (root, dep) => {
    if (root === null) {
        return cy.collection()
    }
    dep = dep.add(root);
    var parents = root.incomers()
    var numNewParents = 0
    for (var i = 0; i < parents.length; i++) {
        var p = parents[i]
        if (!dep.contains(p)) {
            dep = dep.add(calcDepNaive(p, dep))
            numNewParents += dep.length
        }
    }
    if (numNewParents < parents.length - 1) {
        hasCycle = true
        alert("Oh no! We have a dependency cycle...")
    }
    
    if (numNewParents === 0) {
        return dep
    }
    return dep
}

// var validURL = (str) => {
//     var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//       '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//       '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//       '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//       '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//       '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//     return !!pattern.test(str);
// }

/**
 * Set node data to HMTL
 * TODO: get cy neighbors
 * TODO: CLEAN THIS UP!!!
 * @param {*} node 
 */
var setNodeData = (node) => {
    // console.log("setNodeData")
    document.getElementById('nodetitle').innerText = node.data('id');
    if (node.data('subtitle')) {
        document.getElementById('nodesubtitle').innerText = node.data('subtitle');
    }
    var neighbors = node.incomers((el) => el.isNode())
    var ulNodeLinks = document.getElementById('nodelinks');
    var ulNodeDeps = document.getElementById('nodedeps')
    var ulNodeDescs = document.getElementById('nodedescs')
    ulNodeLinks.innerHTML = ''; // dirty wiping
    ulNodeDeps.innerHTML = '';
    ulNodeDescs.innerHTML = '';
    var li = null;
    var depText = null;
    var a = null;
    var data = null;
    var linkText = null;
    for (var i = 0; i < neighbors.length; i++) {
        var dataObj = neighbors[i].data()
        if (dataObj.node_type === 1) { // topic is dep
            li = document.createElement('li');
            depText = document.createTextNode(dataObj.name)
            li.appendChild(depText)
            ulNodeDeps.appendChild(li)
        } else if (dataObj.node_type === 2) { // resource
            data = neighbors[i].data().data
            if (dataObj.resource_type === 1) { // desc
                li = document.createElement('li')
                li.appendChild(document.createTextNode(data))
                ulNodeDescs.appendChild(li)
            } else { // link type
                li = document.createElement('li');
                a = document.createElement('a');
                linkText = document.createTextNode(data.text);
                a.appendChild(linkText);
                a.title = data.text;
                a.href = data.link;
                li.appendChild(a);
                ulNodeLinks.appendChild(li);
            }
        }
    }
}