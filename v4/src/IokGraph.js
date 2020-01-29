import React, { Component } from 'react';
import Cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import cola from 'cytoscape-cola'
import edgehandles from 'cytoscape-edgehandles'
import CytoscapeComponent from 'react-cytoscapejs';

import { regroupCy, registerEdgeHandles } from './listen'

import './styles/IokGraph.css'

Cytoscape.use(cola)
Cytoscape.use(dagre)
Cytoscape.use(edgehandles)

const layout = { name: 'dagre', animate: true };

const TAG = 'IokGraph'

export default class IokGraph extends Component {

  constructor(props) {
    super(props)
    this.saveGraph = this.props.saveGraph
    console.log(TAG, "constructing:", this.props.elements)
    // this.elements = this._isNotEmpty(this.props.elements) ? this.props.elements : DEFL_GRAPH_ELEMENTS
    // this.styles = this._isNotEmpty(this.props.styles) ? this.props.styles : DEFL_GRAPH_STYLE
    this.elements = this.props.elements
    this.styles = this.props.styles
    this.cy = null
    this.cyRegCallback = this.props.cyRegCallback
    // !!! FOR DEBUGGING ONLY !!!
    // this.saveGraph({ elements: this.elements, style: this.styles })
  }

  _isNotEmpty(obj) {
    return obj && obj.length > 0
  }

  handleNodeTap() {
    console.log(TAG, "TAPPED NODE")
  }

  render() {
    return (
      <CytoscapeComponent 
        className="graph" 
        elements={CytoscapeComponent.normalizeElements(this.elements)} 
        stylesheet={this.styles}
        layout={layout} 
        cy={(cy) => { 
          if (this.cy) {
            this.cy.elements().remove()
            console.log(TAG, "REMOVED DATA... RESET!")
            console.log(TAG, this.elements)
            this.cy.json({
              elements: this.elements,
              style: this.styles,
              layout: layout
            })
          }
          if (!this.cy) { // TODO: hacky.... only run this the first time 
            registerEdgeHandles(cy);
          }
          this.cy = cy;
          this.cyRegCallback(cy);
          return new Promise(() => {
            regroupCy()
          })
        }}
      /> 
    );
  }
}
