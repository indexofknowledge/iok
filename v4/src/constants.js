import { AppConfig } from 'blockstack'

export const appConfig = new AppConfig(['store_write', 'publish_data'])

export const GRAPH_FILENAME = 'graph.json'

export const IOKS = []

// TODO: change all the id's since cytoscape will crash if collision
// TODO: change all id's to hashes
// TODO: add names and id to everything
export const DEFL_GRAPH_ELEMENTS = {
  "nodes": [
    {
      "data": {
        "node_type": 1,
        "id": "math",
        "name": "math"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "mathematics is everything",
        "id": "math-SxerygqAlP",
        "name": "math-SxerygqAlP"
      }
    },
    {
      "data": {
        "node_type": 1,
        "id": "computer science",
        "name": "computer science"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "computation and stuff",
        "id": "computer science-XbIEkFXLeK",
        "name": "computer science-XbIEkFXLeK"
      }
    },
    {
      "data": {
        "node_type": 1,
        "id": "lightning",
        "name": "lightning"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "l2 stuff",
        "id": "lightning-tInnovoGad",
        "name": "lightning-tInnovoGad"
      }
    },
    {
      "data": {
        "node_type": 1,
        "id": "bitcoin",
        "name": "bitcoin"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "p2p cash system",
        "id": "bitcoin-xuRUTzrbxp",
        "name": "bitcoin-xuRUTzrbxp"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 4,
        "data": {
          "text": "Bitcoin whitepaper",
          "link": "https://bitcoin.org/bitcoin.pdf"
        },
        "id": "bitcoin-CPLBbVvBQn",
        "name": "bitcoin-CPLBbVvBQn"
      }
    },
    {
      "data": {
        "node_type": 1,
        "id": "consensus",
        "name": "consensus"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "Reaching agreement",
        "id": "consensus-xoQEedvZlT",
        "name": "consensus-xoQEedvZlT"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 4,
        "data": {
          "text": "HotStuff: BFT consensus in the Lens of Blockchain",
          "link": "https://arxiv.org/pdf/1803.05069.pdf"
        },
        "id": "consensus-qrRDufajjA",
        "name": "consensus-qrRDufajjA"
      }
    },
    {
      "data": {
        "node_type": 1,
        "id": "ethereum",
        "name": "ethereum"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "world computer",
        "id": "ethereum-dCPDaweKhB",
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 2,
        "data": {
          "text": "How Bitcoin Works in 5 Minutes (Technical)",
          "link": "https://www.youtube.com/watch?v=l9jOJk30eQs"
        },
        "id": "bitcoin-nOZtIZERDi",
        "name": "bitcoin-nOZtIZERDi"
      }
    }
  ],
  "edges": [
    {
      "data": {
        "id": "abc1",
        "source": "math",
        "target": "bitcoin"
      }
    },
    {
      "data": {
        "id": "abc2",
        "source": "math",
        "target": "consensus"
      }
    },
    {
      "data": {
        "id": "abc3",
        "source": "math-SxerygqAlP",
        "target": "math"
      }
    },
    {
      "data": {
        "id": "abc4",
        "source": "computer science",
        "target": "bitcoin"
      }
    },
    {
      "data": {
        "id": "abc444",
        "source": "computer science",
        "target": "consensus"
      }
    },
    {
      "data": {
        "id": "abc5",
        "source": "computer science-XbIEkFXLeK",
        "target": "computer science"
      }
    },
    {
      "data": {
        "id": "abc6",
        "source": "lightning-tInnovoGad",
        "target": "lightning"
      }
    },
    {
      "data": {
        "id": "abc7",
        "source": "bitcoin",
        "target": "lightning"
      }
    },
    {
      "data": {
        "id": "abc8",
        "source": "bitcoin",
        "target": "ethereum"
      }
    },
    {
      "data": {
        "id": "abc9",
        "source": "bitcoin-xuRUTzrbxp",
        "target": "bitcoin"
      }
    },
    {
      "data": {
        "id": "abc10",
        "source": "bitcoin-CPLBbVvBQn",
        "target": "bitcoin"
      }
    },
    {
      "data": {
        "id": "abc11",
        "source": "consensus",
        "target": "bitcoin"
      }
    },
    {
      "data": {
        "id": "abc12",
        "source": "consensus-xoQEedvZlT",
        "target": "consensus"
      }
    },
    {
      "data": {
        "id": "abc13",
        "source": "consensus-qrRDufajjA",
        "target": "consensus"
      }
    },
    {
      "data": {
        "id": "abc14",
        "source": "ethereum-dCPDaweKhB",
        "target": "ethereum"
      }
    },
    {
      "data": {
        "id": "abc15",
        "source": "bitcoin-nOZtIZERDi",
        "target": "bitcoin"
      }
    }
  ]
}


export const DEFL_GRAPH_STYLE = [
    {
      selector: 'node[name]',
      style: {
        'background-color': '#f8be35',
        'label': 'data(name)'
      }
    },
    {
      selector: 'node[^name]',
      style: {
        'background-color': '#f8be35',
        'label': 'data(id)'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 4,
        'target-arrow-shape': 'triangle',
        'line-color': '#FFE6A9',
        'target-arrow-color': '#FFE6A9',
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
    },

    // BEGIN EH STYLING
  
    {
      selector: '.eh-handle',
      style: {
        'background-color': 'red',
        'width': 12,
        'height': 12,
        'shape': 'ellipse',
        'overlay-opacity': 0,
        'border-width': 12, // makes the handle easier to hit
        'border-opacity': 0
      }
    },
    {
      selector: '.eh-hover',
      style: {
        'background-color': 'red'
      }
    },
    {
      selector: '.eh-source',
      style: {
        'border-width': 2,
        'border-color': 'red'
      }
    },
    {
      selector: '.eh-target',
      style: {
        'border-width': 2,
        'border-color': 'red'
      }
    },
    {
      selector: '.eh-preview, .eh-ghost-edge',
      style: {
        'background-color': 'red',
        'line-color': 'red',
        'target-arrow-color': 'red',
        'source-arrow-color': 'red'
      }
    },
    {
      selector: '.eh-ghost-edge.eh-preview-active',
      style: {
        'opacity': 0
      }
    }
  ]