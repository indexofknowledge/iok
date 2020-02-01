# Index of Knowledge (IoK)

Index of Knowledge (IoK) is a curated collection of resources for blockchain, grouped by topic and topologically ordered by pedagogical dependency. Currently working to support graph visualization and awesome-list clients.

Previous iterations of the IoK failed in part due to centralization of control. Sounds like a good use of blockchain :thonk:, at least to a certain extent. 

## Project structure

Description of folders and the projects they contain. Most will have their own READMEs.

### `v4`

The `v4` folder contains a ReactJS app that uses Blockstack to allow users to create, view, and share others' own IoKs. For example, the link below allows you to see my personal IoK from a guest mode:

https://index-of-knowledge.firebaseapp.com/?guest=true&loaduser=rustielin.id.blockstack

Currently, you can create and share your own IoKs, as well as copy other public IoKs as an authenticated user. As a guest, you can view all public IoKs and add nodes/edges, but none of your changes will persist (naturally).

### `legacy` 

This contains the old IoK client using CommonJS and Cytoscape. Storage happens on GitHub. There was also a mechanism for taking IoK data and linearizing it to programatically generate the README, in the format of an awesome-list. 

Mostly deprecated, but there's some bits we can salvage into v4. 



