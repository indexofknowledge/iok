import { AppConfig } from 'blockstack'

export const appConfig = new AppConfig(['store_write', 'publish_data'])

export const GRAPH_FILENAME = 'graph.json'

export const IOKS = []

export const DEFL_GRAPH_ELEMENTS = {
    nodes: [
      {
        node_type: 1,
        id: "math"
      },
      {
        node_type: 2,
        resource_type: 1,
        data: "mathematics is everything",
        id: "math-SxerygqAlP"
      },
      {
        node_type: 1,
        id: "computer science"
      },
      {
        node_type: 2,
        resource_type: 1,
        data: "computation and stuff",
        id: "computer science-XbIEkFXLeK"
      },
      {
        node_type: 1,
        id: "lightning"
      },
      {
        node_type: 2,
        resource_type: 1,
        data: "l2 stuff",
        id: "lightning-tInnovoGad"
      },
      {
        node_type: 1,
        id: "bitcoin"
      },
      {
        node_type: 2,
        resource_type: 1,
        data: "p2p cash system",
        id: "bitcoin-xuRUTzrbxp"
      },
      {
        node_type: 2,
        resource_type: 4,
        data: {
          text: "Bitcoin whitepaper",
          link: "https://bitcoin.org/bitcoin.pdf"
        },
        id: "bitcoin-CPLBbVvBQn"
      },
      {
        node_type: 1,
        id: "consensus"
      },
      {
        node_type: 2,
        resource_type: 1,
        data: "Reaching agreement",
        id: "consensus-xoQEedvZlT"
      },
      {
        node_type: 2,
        resource_type: 4,
        data: {
          text: "HotStuff: BFT consensus in the Lens of Blockchain",
          link: "https://arxiv.org/pdf/1803.05069.pdf"
        },
        id: "consensus-qrRDufajjA"
      },
      {
        node_type: 1,
        id: "ethereum"
      },
      {
        node_type: 2,
        resource_type: 1,
        data: "world computer",
        id: "ethereum-dCPDaweKhB"
      },
      {
        node_type: 2,
        resource_type: 2,
        data: {
          text: "How Bitcoin Works in 5 Minutes (Technical)",
          link: "https://www.youtube.com/watch?v=l9jOJk30eQs"
        },
        id: "bitcoin-nOZtIZERDi"
      }
    ],
    links: [
      {
        source: "math",
        target: "bitcoin"
      },
      {
        source: "math",
        target: "consensus"
      },
      {
        source: "math-SxerygqAlP",
        target: "math"
      },
      {
        source: "computer science",
        target: "bitcoin"
      },
      {
        source: "computer science",
        target: "consensus"
      },
      {
        source: "computer science-XbIEkFXLeK",
        target: "computer science"
      },
      {
        source: "lightning-tInnovoGad",
        target: "lightning"
      },
      {
        source: "bitcoin",
        target: "lightning"
      },
      {
        source: "bitcoin",
        target: "ethereum"
      },
      {
        source: "bitcoin-xuRUTzrbxp",
        target: "bitcoin"
      },
      {
        source: "bitcoin-CPLBbVvBQn",
        target: "bitcoin"
      },
      {
        source: "consensus",
        target: "bitcoin"
      },
      {
        source: "consensus-xoQEedvZlT",
        target: "consensus"
      },
      {
        source: "consensus-qrRDufajjA",
        target: "consensus"
      },
      {
        source: "ethereum-dCPDaweKhB",
        target: "ethereum"
      },
      {
        source: "bitcoin-nOZtIZERDi",
        target: "bitcoin"
      }
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