console.log("IoK init")
var graphData = 'fakedata'

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile("../graph.json", function(text){
    graphData = JSON.parse(text);
    // change the data format to what cytoscape wants
    var nodes = []
    for (var i = 0; i < graphData.nodes.length; i++) {
        nodes[i] = {"data": graphData.nodes[i]}
    }
    console.log(nodes)
    var edges = []
    for (var i = 0; i < graphData.links.length; i++) {
        edges[i] = {"data": graphData.links[i]}
    }
    console.log(edges)

    var cy = window.cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,

      layout: {
        name: 'dagre'
      },

      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#11479e',
            'content': 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 4,
            'target-arrow-shape': 'triangle',
            'line-color': '#9dbaea',
            'target-arrow-color': '#9dbaea',
            'curve-style': 'bezier'
          }
        },
        {
          selector: '.highlighted',
          style: {
            'background-color': '#75b5aa',
            'line-color': '#75b5aa',
            'target-arrow-color': '#75b5aa',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
          }
        }
      ],

      elements: {
        nodes: nodes,
        edges: edges
      }
    });

    // LISTEN
    cy.on('tap', 'node', handleNodeTap);
    console.log('Add node tap listener')

});