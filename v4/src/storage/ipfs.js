// eslint-disable-line
import Log from '../log';

const TAG = 'storage.ipfs';
const base = 'https://ipfs.io/ipfs/';
const pinataProxy = 'https://us-central1-index-of-knowledge.cloudfunctions.net/storeGraph';

export const loadIPFSGraph = (hash, onSuccess, onError) => {
  Log.info(TAG, 'Loading from IPFS', hash);
  const url = base + hash;
  fetch(url).then((response) => response.json()).then((data) => {
    onSuccess(data);
  }).catch((err) => {
    onError(err);
  });
};

export const saveIPFSGraph = (graph) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graph),
  };
  Log.info("GRAPH", graph)
  fetch(pinataProxy, requestOptions)
    .then((response) => {Log.info("RESPONSE", response); return response.json()})
    .then((data) => alert(data.IpfsHash))
    .catch((err) => Log.error(err));
};
