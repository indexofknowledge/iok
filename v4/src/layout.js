function TreeCircleLayout(options) {
  this.options = options;
}

const getInfo = (ele) => ele.scratch('treecircle');
const setInfo = (ele, obj) => ele.scratch('treecircle', obj);

const SPACING = 100;

/** Return (theta, rootid, maxspaceforchildren, numberofchildren) tuple */
function theta(ele) {
  const { index, parent, children } = getInfo(ele);
  if (!parent) return [0, 2 * Math.PI, children];
  const [ptheta, pmaxspace, pchildren] = theta(parent);
  const angle = (index / pchildren - 0.5) * pmaxspace + ptheta;
  return [angle, pmaxspace / pchildren, children];
}

TreeCircleLayout.prototype.run = function () {
  const { eles } = this.options;
  const roots = eles.leaves();
  const cx = this.options.cy.width() / 2;
  const cy = this.options.cy.height() / 2;

  let maxDepth = 0;
  // Perform bfs on each root to assign depths and indices
  roots.forEach((root, rootIndex) => {
    eles.bfs({
      roots: [root],
      directed: false,
      visit(node, e, parent, i, depth) {
        const ele = node[0];
        let index = 0;
        if (parent) {
          const parInfo = getInfo(parent);
          index = (parInfo.children || 0);
          parInfo.children = index + 1;
        }
        setInfo(ele, {
          depth, index, parent, rootIndex,
        });
        maxDepth = Math.max(maxDepth, depth);
      },
    });
  });

  // Treat roots as sides of a regular polygone with side length 2*rootSeparation
  // The distance from a vertex to the center is rootRadius
  const rootSeparation = (maxDepth + 0.5) * SPACING;
  const rootDivider = Math.sin(Math.PI / roots.length);
  const rootRadius = roots.length < 2 ? 0 : rootSeparation / rootDivider;
  this.options.eles.layoutPositions(this, this.options, (ele) => {
    const { depth, rootIndex } = getInfo(ele);
    const rootAngle = (2 * Math.PI * rootIndex) / roots.length;

    const radius = depth * SPACING;
    const angle = theta(ele)[0];
    return {
      x: cx + rootRadius * Math.cos(rootAngle) + radius * Math.cos(angle),
      y: cy + rootRadius * Math.sin(rootAngle) + radius * Math.sin(angle),
    };
  });
};

export default function register(cytoscape) {
  cytoscape('layout', 'treeCircle', TreeCircleLayout);
}
