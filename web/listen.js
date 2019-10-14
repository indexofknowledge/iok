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

var toggleMeta = () => {
    console.log("TOGGLING META")
    var resources = cy.nodes('[node_type > 1]')
    if (resources.length == 0) {
        console.log("No resources found, can't toggle meta")
        return
    }
    var replacementStyle = "none"
    if (resources[0].style("display") == "none") {
        replacementStyle = "element"
    } 
    for (var i = 0; i < resources.length; i++) {
        resources[i].style("display", replacementStyle)
    }
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
    var p = document.getElementById('nodetext')
    ul.innerHTML = '';
    p.innerHTML = '';
    console.log("Has data")
    for (i = 0; i < neighbors.length; i++) {
        var dataObj = neighbors[i].data()
        if ("data" in dataObj) {  // RESOURCE
            data = neighbors[i].data().data
            if (validURL(data)) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                var linkText = document.createTextNode(data);
                a.appendChild(linkText);
                a.title = data;
                a.href = data;
                li.appendChild(a);
                ul.appendChild(li);
            } else {
                p.appendChild(document.createTextNode(data))
            }
        } else {  // TITLE
            console.log("Not listing parent")
        }
    }
}