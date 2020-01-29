import { AppConfig } from 'blockstack'

export const appConfig = new AppConfig(['store_write', 'publish_data'])

export const GRAPH_FILENAME = 'graph.json'

export const IOKS = []

export const DEFL_GRAPH_ELEMENTS = {
    nodes: [
      { data: { id: 'n0' } },
      { data: { id: 'n1' } },
      { data: { id: 'n2' } },
      { data: { id: 'n3' } },
      { data: { id: 'n4' } },
      { data: { id: 'n5' } },
      { data: { id: 'n6' } },
      { data: { id: 'n7' } },
      { data: { id: 'n8' } },
      { data: { id: 'n9' } },
      { data: { id: 'n10' } },
      { data: { id: 'n11' } },
      { data: { id: 'n12' } },
      { data: { id: 'n13' } },
      { data: { id: 'n14' } },
      { data: { id: 'n15' } },
      { data: { id: 'n16' } }
    ],
    edges: [
      { data: { source: 'n0', target: 'n1' } },
      { data: { source: 'n1', target: 'n2' } },
      { data: { source: 'n1', target: 'n3' } },
      { data: { source: 'n4', target: 'n5' } },
      { data: { source: 'n4', target: 'n6' } },
      { data: { source: 'n6', target: 'n7' } },
      { data: { source: 'n6', target: 'n8' } },
      { data: { source: 'n8', target: 'n9' } },
      { data: { source: 'n8', target: 'n10' } },
      { data: { source: 'n11', target: 'n12' } },
      { data: { source: 'n12', target: 'n13' } },
      { data: { source: 'n13', target: 'n14' } },
      { data: { source: 'n13', target: 'n15' } },
    ]
  }

export const DEFL_GRAPH_STYLE = [
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
      selector: '.selected',
      style: {
        'background-color': '#E8747C'
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
    },
    {
      selector: '.altHighlighted',
      style: {
        'background-color': '#E8747C',
        'line-color': '#E8747C',
        'target-arrow-color': '#E8747C',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      }
    }
  ]