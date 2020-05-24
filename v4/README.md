# IoK Client v4

This is a hacky ReactJS app that fetches IoK data from a storage backend and allows manipulation via [CytoscapeJS](https://js.cytoscape.org/) graph visualization library.

## Frontend

Feature smainly a nav bar and a vertical split-screen main panel. Nav bar, `NavBar.jsx`, displays some metadata about the storage configuration (e.g. Blockstack ID/loaduser, IPFS hash, toggles). For legacy reasons, most of the app is in `SignedIn.jsx`. This renders after query params for storage backends are parsed and handled.

A quick rundown of some notable files/directories:

* `constants.js` contains some configurations and default IoK to be loaded from file
* `listen.js` contains listeners for the cytoscape graph for adding nodes and edges
* `log.js` allows us to use the console log to debug, but hide it from production
* `types.js` contains some basic types. This needs to be more flushed out or we can migrate to TypeScript.
* `storage` contains our storage backends

## Storage Backends

We currently support both Blockstack and IPFS storage backends. Basic operations are `load` and `save`. On the web client, we parse query params for storage and storage options.

### Blockstack

Usage of Blockstack storage backend is specified by `storage=blockstack` in query params. Blockstack can be used with and without authentication, with `guest=true`. `loaduser` param tells the client where to load IoK data from. All data is stored unencrypted so it's a simple query from the Blockstack SDK.

### IPFS

Usage of IPFS storage backend is specified by `storage=ipfs` in query params. We don't need authentication for IPFS. To load data from IPFS, we can simply fetch from the IPFS official gateway: `ipfs.io/ipfs/<hash>`. We expect the `hash` query param for this client. To save data, we POST our current graph to one of our cloud functions that pins that file.

## Dev Setup

* `npm install` and `npm run start` to launch in dev mode
* `npm run build` to make a production build
* `npm run lint` to lint using ESlint

## Firebase

An easy way to get started deploying is with Firebase Hosting. We use a Firebase Hosting [multi-site setup](https://firebase.google.com/docs/hosting/multisites) as seen in `firebase.json`. This allows us to deploy to various hosting targets depending on the type of build, e.g. `firebase deploy --project index-of-knowledge --only hosting:susan`. Once your Firebase project is registered with your email, and you have CLI properly configured and authenticated, it needs to be added as a target in our `firebase.json` and `.firebaserc` to be tracked. You may also need to be added to the parent `index-of-knowledge` Firebase project we use to host our prod builds.

Since we don't have many unit tests, and no one has the time to write any of them, we can do a minimal amount of QA before wrecking anything by hosting a personal build such as on https://iok-susan.web.app/ and linking that in your PR. Then reviewers can do a mini-bug bash to make sure that the added features work and that nothing too terrible has broken. :)


