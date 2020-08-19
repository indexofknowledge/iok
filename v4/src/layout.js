function TreeCircleLayout(options) {
    this.options = options;
}

const getInfo = ele => ele.scratch('treecircle');
const setInfo = (ele, obj) => ele.scratch('treecircle', obj);

/** Update a node's depth and position in the tree */
function visit(node, e, parent, i, depth) {
    const ele = node[0];
    let index = 0;
    if (parent) {
        const parInfo = getInfo(parent);
        index = (parInfo.children || 0);
        parInfo.children = index + 1;
    }
    setInfo(ele, { depth, index, parent });
}

/** Return (theta, maxspaceforchildren, numberofchildren) tuple */
function theta(ele) {
    const { index, parent, children } = getInfo(ele);
    if (!parent) return [0, 2*Math.PI, children];

    const [ptheta, pmaxspace, pchildren] = theta(parent);
    const angle = (index / pchildren - 0.5) * pmaxspace + ptheta;
    return [angle, pmaxspace / pchildren, children];
}

TreeCircleLayout.prototype.run = function() {
    const eles = this.options.eles;
    const roots = eles.leaves();
    const cx = this.options.cy.width() / 2;
    const cy = this.options.cy.height() / 2;

    eles.bfs({ roots, directed: false, visit });

    this.options.eles.layoutPositions(this, this.options, (ele) => {
        const { depth } = getInfo(ele);
        const radius = depth * 100;
        const angle = theta(ele)[0];
        return {
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle)
        };
    });
}

export default function register(cytoscape) {
    cytoscape('layout', 'treeCircle', TreeCircleLayout);
}
