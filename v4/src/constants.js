// eslint-disable-line
import { AppConfig } from 'blockstack';
import { STORAGE_TYPES } from './types';

export const appConfig = new AppConfig(['store_write', 'publish_data']);

export const GRAPH_FILENAME = 'graph.json';

export const DEFL_STORAGE = STORAGE_TYPES.IPFS;

export const DEFL_STORAGE_OPTIONS = {
  hash: 'bafyreicuan6hdr7jaz5e7pdevsjqjtviigil5achefs6lcwdaah5zc57le',
};

export const IOKS = [
  {
    user: 'rustielin.id.blockstack',
    app: 'https://index-of-knowledge.firebaseapp.com/?loaduser=rustielin.id.blockstack',
  },
  {
    user: 'rustielintest.id.blockstack',
    app: 'https://index-of-knowledge-beta.firebaseapp.com/?loaduser=rustielintest.id.blockstack',
  },
];

// TODO: change all the id's since cytoscape will crash if collision
// TODO: change all id's to hashes
// TODO: add names and id to everything
export const DEFL_GRAPH_ELEMENTS = {
  nodes: [
    {
      data: {
        name: 'math',
        node_type: 1,
        id: '0ed8f58bf8b3ae5ba6b882961eff9068c84268522fdf1b9a7fdc90cae0e9a703',
      },
    },
    {
      data: {
        name: 'computer science',
        node_type: 1,
        id: '48cd5a52518c7054ade553b6e0eb991d315ecfe96164b44c13dc47269c954982',
      },
    },
    {
      data: {
        name: 'economics',
        node_type: 1,
        id: 'a4be61c650fefcc75b406cbf120212a6ffe71c3a983f64e603e1b823e575abbb',
      },
    },
    {
      data: {
        name: 'bitcoin',
        node_type: 1,
        id: '04eaf9a2a65d37f254fab35f969da7b133cea2087e1be846ea2dc8ccbb0e2470',
      },
    },
    {
      data: {
        resource_type: 1,
        data: {
          text: 'Computer science is the study of processes that interact with data and that can be represented as data in the form of programs.',
          link: '',
        },
        node_type: 2,
        id: '8d3e61ce168c16ae5c10fc0eb2085e7063844736be62d37c1318b437e60a06b2',
        name: 'res-8d3e61ce16',
      },
    },
    {
      data: {
        resource_type: 1,
        data: {
          text: 'Economics is the social science that studies the production, distribution, and consumption of goods and services.',
          link: '',
        },
        node_type: 2,
        id: '71686ead6a4dc2481870877da6a888fab7c488819572c391b71acabd047930fe',
        name: 'res-71686ead6a',
      },
    },
    {
      data: {
        resource_type: 1,
        data: {
          text: 'Mathematics is the study of abstract objects and structures that are often, but not always, abstracted from the physical world. It includes the study of such abstractions as quantity, structure, space and shapes, and change.',
          link: '',
        },
        node_type: 2,
        id: '4fba4eba5e774c7a67c951001f27784d63116b4fc182b9977254bd1223e185a1',
        name: 'res-4fba4eba5e',
      },
    },
    {
      data: {
        resource_type: 1,
        data: {
          text: 'Bitcoin is an innovative payment network and a new kind of money.',
          link: '',
        },
        node_type: 2,
        id: 'e6f043e27913e1ceb469bfbcc6eca983a374918618c4912e65f4756f6e177855',
        name: 'res-e6f043e279',
      },
    },
    {
      data: {
        resource_type: 4,
        data: {
          text: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
          link: 'https://bitcoin.org/bitcoin.pdf',
        },
        node_type: 2,
        id: '5e71f1ce88b810081fc39b4aae938593e8ddf086d93b544ae83c51bcb2905319',
        name: 'res-5e71f1ce88',
      },
    },
  ],
  edges: [
    {
      data: {
        source: '48cd5a52518c7054ade553b6e0eb991d315ecfe96164b44c13dc47269c954982',
        target: '04eaf9a2a65d37f254fab35f969da7b133cea2087e1be846ea2dc8ccbb0e2470',
        id: '0f366f92-58ca-4f29-b942-da41ca8863c7',
      },
    },
    {
      data: {
        source: '0ed8f58bf8b3ae5ba6b882961eff9068c84268522fdf1b9a7fdc90cae0e9a703',
        target: '04eaf9a2a65d37f254fab35f969da7b133cea2087e1be846ea2dc8ccbb0e2470',
        id: '090d2ffb-9a72-4660-a7a7-247119ba47a0',
      },
    },
    {
      data: {
        source: 'a4be61c650fefcc75b406cbf120212a6ffe71c3a983f64e603e1b823e575abbb',
        target: '04eaf9a2a65d37f254fab35f969da7b133cea2087e1be846ea2dc8ccbb0e2470',
        id: '27ef1ee0-344b-4961-9afd-3639e32c6736',
      },
    },
    {
      data: {
        source: '8d3e61ce168c16ae5c10fc0eb2085e7063844736be62d37c1318b437e60a06b2',
        target: '48cd5a52518c7054ade553b6e0eb991d315ecfe96164b44c13dc47269c954982',
        id: '3a33c7c3-714a-4da4-a1e4-dbcc1cd1c86b',
      },
    },
    {
      data: {
        source: '71686ead6a4dc2481870877da6a888fab7c488819572c391b71acabd047930fe',
        target: 'a4be61c650fefcc75b406cbf120212a6ffe71c3a983f64e603e1b823e575abbb',
        id: '92369729-24e4-4f83-9aa0-a72667cf9191',
      },
    },
    {
      data: {
        source: '4fba4eba5e774c7a67c951001f27784d63116b4fc182b9977254bd1223e185a1',
        target: '0ed8f58bf8b3ae5ba6b882961eff9068c84268522fdf1b9a7fdc90cae0e9a703',
        id: '1f3f5e7e-bf90-43ba-ace5-0fbfe462872b',
      },
    },
    {
      data: {
        source: 'e6f043e27913e1ceb469bfbcc6eca983a374918618c4912e65f4756f6e177855',
        target: '04eaf9a2a65d37f254fab35f969da7b133cea2087e1be846ea2dc8ccbb0e2470',
        id: '649c601a-dd57-42a9-ba1f-5053c37152e0',
      },
    },
    {
      data: {
        source: '5e71f1ce88b810081fc39b4aae938593e8ddf086d93b544ae83c51bcb2905319',
        target: '04eaf9a2a65d37f254fab35f969da7b133cea2087e1be846ea2dc8ccbb0e2470',
        id: '53e2e0a4-a766-4b9e-a88a-a87c7d293772',
      },
    },
  ],
};


export const DEFL_GRAPH_STYLE = [
  {
    selector: 'node[name]',
    style: {
      'background-color': '#f8be35',
      label: 'data(name)',
    },
  },
  {
    selector: 'edge',
    style: {
      width: 4,
      'target-arrow-shape': 'triangle',
      'line-color': '#FFE6A9',
      'target-arrow-color': '#FFE6A9',
      'curve-style': 'bezier',
    },
  },
  {
    selector: '.selected',
    style: {
      'background-color': '#E8747C',
    },
  },
  {
    selector: '.highlighted',
    style: {
      'background-color': '#75b5aa',
      'line-color': '#75b5aa',
      'target-arrow-color': '#75b5aa',
      'transition-property': 'background-color, line-color, target-arrow-color',
      'transition-duration': '0.5s',
    },
  },
  {
    selector: '.altHighlighted',
    style: {
      'background-color': '#E8747C',
      'line-color': '#E8747C',
      'target-arrow-color': '#E8747C',
      'transition-property': 'background-color, line-color, target-arrow-color',
      'transition-duration': '0.5s',
    },
  },

  // BEGIN EH STYLING

  {
    selector: '.eh-handle',
    style: {
      'background-color': 'red',
      width: 12,
      height: 12,
      shape: 'ellipse',
      'overlay-opacity': 0,
      'border-width': 12, // makes the handle easier to hit
      'border-opacity': 0,
    },
  },
  {
    selector: '.eh-hover',
    style: {
      'background-color': 'red',
    },
  },
  {
    selector: '.eh-source',
    style: {
      'border-width': 2,
      'border-color': 'red',
    },
  },
  {
    selector: '.eh-target',
    style: {
      'border-width': 2,
      'border-color': 'red',
    },
  },
  {
    selector: '.eh-preview, .eh-ghost-edge',
    style: {
      'background-color': 'red',
      'line-color': 'red',
      'target-arrow-color': 'red',
      'source-arrow-color': 'red',
    },
  },
  {
    selector: '.eh-ghost-edge.eh-preview-active',
    style: {
      opacity: 0,
    },
  },
];
