import React, { Component } from 'react';
import Cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import CytoscapeComponent from 'react-cytoscapejs';

import { DEFL_GRAPH_ELEMENTS, DEFL_GRAPH_STYLE } from './constants'
import './styles/IokGraph.css'

Cytoscape.use(dagre)

const layout = { name: 'dagre' };

export default class IokGraph extends Component {

  constructor(props) {
    super(props)
    this.saveGraph = this.props.saveGraph
    console.log("GOT:", this.props.elements)
    this.elements = this._isNotEmpty(this.props.elements) ? this.props.elements : DEFL_GRAPH_ELEMENTS
    this.styles = this._isNotEmpty(this.props.styles) ? this.props.styles : DEFL_GRAPH_STYLE
    this.cy = null
    this.cyRegCallback = this.props.cyRegCallback
    // !!! FOR DEBUGGING ONLY !!!
    // this.saveGraph({ elements: this.elements, style: this.styles })
  }

  _isNotEmpty(obj) {
    return obj && obj.length > 0
  }

  handleNodeTap() {
    console.log("TAPPED NODE")
  }

  render() {
    return (
      <CytoscapeComponent 
        className="graph" 
        elements={CytoscapeComponent.normalizeElements(this.elements)} 
        stylesheet={this.styles}
        layout={layout} 
        cy={(cy) => { 
          this.cy = cy;
          this.cyRegCallback(cy);
          cy.fit(); // for now...
          // this.cy.on('tap', 'node', this.handleNodeTap);
        }}
      /> 
    );
  }
}
