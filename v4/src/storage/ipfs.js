// eslint-disable-line
import { getFullGraph, putGraph } from 'ipfs-cytoscape';
import Log from '../log';

const TAG = 'storage.ipfs';

export const loadIPFSGraph = (hash, onSuccess, onError) => {
  Log.info(TAG, 'Loading from IPFS', hash);
  getFullGraph(hash)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err));
};

export const saveIPFSGraph = (graph, onHashChange) => {
  putGraph(graph)
    .then((data) => { Log.info(TAG, data); onHashChange(data); })
    .catch((err) => Log.error(err));
};
