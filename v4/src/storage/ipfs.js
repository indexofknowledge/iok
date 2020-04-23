// eslint-disable-line
import Log from '../log';

const TAG = 'storage.ipfs';
const base = 'https://ipfs.io/ipfs/';

const loadIPFSGraph = (hash, onSuccess, onError) => {
  Log.info(TAG, 'Loading from IPFS', hash);
  const url = base + hash;
  fetch(url).then((response) => response.json()).then((data) => {
    onSuccess(data);
  }).catch((err) => {
    onError(err);
  });
};

export default loadIPFSGraph;
