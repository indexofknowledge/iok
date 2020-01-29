import { AppConfig } from 'blockstack'

export const appConfig = new AppConfig(['store_write', 'publish_data'])

export const GRAPH_FILENAME = 'graph.json'

export const IOKS = []

export const DEFL_GRAPH_ELEMENTS = {
  "nodes": [
    {
      "data": {
        "node_type": 1,
        "id": "math"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "mathematics is everything",
        "id": "math-SxerygqAlP"
      }
    },
    {
      "data": {
        "node_type": 1,
        "id": "computer science"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "computation and stuff",
        "id": "computer science-XbIEkFXLeK"
      }
    },
    {
      "data": {
        "node_type": 1,
        "id": "lightning"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "l2 stuff",
        "id": "lightning-tInnovoGad"
      }
    },
    {
      "data": {
        "node_type": 1,
        "id": "bitcoin"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "p2p cash system",
        "id": "bitcoin-xuRUTzrbxp"
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
        "id": "bitcoin-CPLBbVvBQn"
      }
    },
    {
      "data": {
        "node_type": 1,
        "id": "consensus"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "Reaching agreement",
        "id": "consensus-xoQEedvZlT"
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
        "id": "consensus-qrRDufajjA"
      }
    },
    {
      "data": {
        "node_type": 1,
        "id": "ethereum"
      }
    },
    {
      "data": {
        "node_type": 2,
        "resource_type": 1,
        "data": "world computer",
        "id": "ethereum-dCPDaweKhB"
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
        "id": "bitcoin-nOZtIZERDi"
      }
    }
  ],
  "edges": [
    {
      "data": {
        "source": "math",
        "target": "bitcoin"
      }
    },
    {
      "data": {
        "source": "math",
        "target": "consensus"
      }
    },
    {
      "data": {
        "source": "math-SxerygqAlP",
        "target": "math"
      }
    },
    {
      "data": {
        "source": "computer science",
        "target": "bitcoin"
      }
    },
    {
      "data": {
        "source": "computer science",
        "target": "consensus"
      }
    },
    {
      "data": {
        "source": "computer science-XbIEkFXLeK",
        "target": "computer science"
      }
    },
    {
      "data": {
        "source": "lightning-tInnovoGad",
        "target": "lightning"
      }
    },
    {
      "data": {
        "source": "bitcoin",
        "target": "lightning"
      }
    },
    {
      "data": {
        "source": "bitcoin",
        "target": "ethereum"
      }
    },
    {
      "data": {
        "source": "bitcoin-xuRUTzrbxp",
        "target": "bitcoin"
      }
    },
    {
      "data": {
        "source": "bitcoin-CPLBbVvBQn",
        "target": "bitcoin"
      }
    },
    {
      "data": {
        "source": "consensus",
        "target": "bitcoin"
      }
    },
    {
      "data": {
        "source": "consensus-xoQEedvZlT",
        "target": "consensus"
      }
    },
    {
      "data": {
        "source": "consensus-qrRDufajjA",
        "target": "consensus"
      }
    },
    {
      "data": {
        "source": "ethereum-dCPDaweKhB",
        "target": "ethereum"
      }
    },
    {
      "data": {
        "source": "bitcoin-nOZtIZERDi",
        "target": "bitcoin"
      }
    }
  ]
}


export const DEFL_GRAPH_STYLE = [
    {
      selector: 'node[id]',
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