import Log from './log';
import { UserSession } from 'blockstack';
import { DEFL_STORAGE, DEFL_STORAGE_OPTIONS } from './constants';
import { loadCache, saveCache } from './storage/cache';
import { loadBlockstackGraph } from './storage/blockstack';
import { loadIPFSGraph } from './storage/ipfs';
import { STORAGE_TYPES } from './types';

export const DEFAULT_SESSION = new UserSession();

/**
 * Load cy instance from various storage providers
 */
function loadGraph(storage, options, userSession = DEFAULT_SESSION) {
  return new Promise((onSuccessLoadGraph, onErrorLoadGraph) => {
    // only load from cache if it's valid and it's what we're requesting
    const cached = loadCache((err) => { Log.error(err, 'cache invalid'); });
    if (Object.keys(cached).length > 0) {
      // cache is exactly what we're requesting if it's the same storage and options
      // e.g. loading from a cached IoK copied from someone's blockstack storage
      if ((cached.storage === storage
        && JSON.stringify(cached.options) === JSON.stringify(options))) {
        Log.info('Load request cache');
        onSuccessLoadGraph(cached.graph);
        console.log("cached graph", cached.graph);
        return;
      }
      // if we're loading the default graph, check cache first
      if (storage === DEFL_STORAGE
        && JSON.stringify(options) === JSON.stringify(DEFL_STORAGE_OPTIONS)) {
        Log.info('Load DEFL request cache');
        onSuccessLoadGraph(cached.graph);
        return;
      }
    }

    switch (storage) {
      case STORAGE_TYPES.IPFS:
        console.log("GOING INTO IPFS");
        loadIPFSGraph(options.hash, onSuccessLoadGraph, onErrorLoadGraph);
        break;
      case STORAGE_TYPES.BLOCKSTACK:
        loadBlockstackGraph(
          userSession,
          options.loaduser,
          onSuccessLoadGraph,
          onErrorLoadGraph,
        );
        break;
      default:
        break;
    }
  }).then((jsonGraph) => {
    saveCache(jsonGraph, storage, options);
    return jsonGraph;
  });
}

export { loadGraph };
