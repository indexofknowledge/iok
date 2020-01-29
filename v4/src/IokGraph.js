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
    this.elements = this.props.elements ? this.props.elements : DEFL_GRAPH_ELEMENTS
    this.styles = this.props.styles ? this.props.styles : DEFL_GRAPH_STYLE
    this.state = {
      cyLoaded: false,
      cy: null
    }
  }


  render() {
    return (
      <CytoscapeComponent 
        className="graph" 
        elements={CytoscapeComponent.normalizeElements(this.elements)} 
        stylesheet={this.styles}
        layout={layout} 
      /> 
    );
  }
}
