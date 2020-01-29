import React, { Component } from 'react';
import Cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import cola from 'cytoscape-cola'
import edgehandles from 'cytoscape-edgehandles'
import CytoscapeComponent from 'react-cytoscapejs';

import { regroupCy } from './listen'

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

  registerEdgeHandles(cy) {
    var eh = cy.edgehandles({preview: false});
    eh.enableDrawMode()
    cy.on('ehcomplete', (event, sourceNode, targetNode, addedEles) => {
      // let { position } = event;
      console.log(TAG, "Added edge...")
      console.log(TAG, "source:", sourceNode)
      console.log(TAG, "target:", targetNode)
      console.log(TAG, "eles:", cy.elements().length)
      // console.log(TAG, cy.nodes().length)
    });
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
          this.cy = cy;
          this.cyRegCallback(cy);
          this.registerEdgeHandles(cy);
          return new Promise(() => {
            regroupCy()
          })
        }}
      /> 
    );
  }
}
