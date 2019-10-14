var handleNodeTap = (evt) => {
    console.log('Node tapped')
    setNodeData(evt.target);
    // edit mode?
    // draw dependencies
}

var validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }


/**
 * Set selected node, based on touch evt
 * Can have up to 2 selected nodes (source, target) or and 1 edge
 * @param {*} evt 
 */
var tappedNode = (evt) => {
    selectedEdge = null; // clearing this for sanity
    var node = evt.target;
    if (selectedSource == null && selectedTarget == null) { // both empty, set source
        clearHighlighted();
        selectedSource = node;
        selectedSource.addClass('highlighted');
        return;
    } else { // reset
        clearHighlighted();
        selectedSource = node;
        selectedSource.addClass('highlighted');
        selectedTarget = null;
    }
}

var clearHighlighted = () => {
    cy.nodes().forEach(removeHighlighted);
    cy.nodes().forEach(unselect);
}

var removeHighlighted = ( el ) => {
    el.removeClass('highlighted');
}

var unselect = async ( el ) => {
    el.removeClass('selected');
    el.unselect();
}

/**
 * Set node data to HMTL
 * TODO: get cy neighbors
 * @param {*} node 
 */
var setNodeData = (node) => {
    document.getElementById('nodetitle').innerText = node.data('id');
    if (node.data('subtitle')) {
        document.getElementById('nodesubtitle').innerText = node.data('subtitle');
    }
    // console.log(node.incomers())
    // var neighbors = node.ancestors((el) => true)
    var neighbors = node.incomers((el) => el.isNode())
    console.log("Listing neighbors...")
    console.log(neighbors)
    // for (var i = 0; i < neighbors.length; i++) {
    //     if (node.data('data')) {
    //         document.getElementById('nodetext').innerHTML += node.data('data').replace(/\\n/g, '<br><br>'); // hmmm
    //     }
    // }

    // set link data
    var ul = document.getElementById('nodelinks');
    ul.innerHTML = '';
    console.log("Has data")
    for (i = 0; i < neighbors.length; i++) {
        var dataObj = neighbors[i].data()
        if ("data" in dataObj) {  // RESOURCE
            var li = document.createElement('li');
            data = neighbors[i].data().data
            if (validURL(data)) {
                var a = document.createElement('a');
                var linkText = document.createTextNode(data);
                a.appendChild(linkText);
                a.title = data;
                a.href = data;
                li.appendChild(a);
            } else {
                li.appendChild(document.createTextNode(data))
            }
            ul.appendChild(li);
        } else {  // TITLE
            console.log("Not listing parent")
        }
    }
}