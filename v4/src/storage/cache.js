// eslint-disable-line
import Log from '../log';

const TAG = 'storage.localstorage';

/**
 * NOTE: this only allows us to cache one graph at a time now.
 * While this might be easier to understand to the end user,
 * we could also allow caching for each (storage, options), but that might get confusing
 */
const KEY = 'localgraph';
const STORAGE_KEY = 'storagetype';
const OPTIONS_KEY = 'storageoptions';

/**
 * Loads graph, storage, and options (metadata) from cache in localstorage
 * only if cache exists and there are nodes and edges to populate
 * @param {*} onError
 */
export const loadCache = (onError) => {
  Log.info(TAG, 'Loading from localstorage');
  const storedGraph = localStorage.getItem(KEY);
  const storage = localStorage.getItem(STORAGE_KEY);
  const storedOptions = localStorage.getItem(OPTIONS_KEY);
  try {
    if (storedGraph && storage && storedOptions) {
      const graph = JSON.parse(storedGraph);
      if (graph.elements !== null
        && graph.elements.nodes.length > 0 && graph.elements.edges.length > 0) {
        const options = JSON.parse(storedOptions);
        Log.info(TAG, 'Got from graph from localstorage');
        Log.info(TAG, graph);
        return { graph, storage, options };
      }
      onError('cached graph is empty, skipping');
    }
    onError('cache is empty');
  } catch (err) {
    onError(err);
  }
  return {};
};

/**
 * Saves graph, storage, options to cache in localstorage
 * @param {*} graph 
 * @param {*} storage 
 * @param {*} options 
 */
export const saveCache = (graph, storage, options) => {
  // Log.info(TAG, 'Saving graph to localstorage');
  // Log.info(TAG, graph);
  try {
    const graphStr = JSON.stringify(graph);
    localStorage.setItem(KEY, graphStr);
    localStorage.setItem(STORAGE_KEY, storage);
    const optionsStr = JSON.stringify(options);
    localStorage.setItem(OPTIONS_KEY, optionsStr);
    Log.info(TAG, 'localstorage save successful');
  } catch (err) {
    // pass
  }
};

export const wipeCache = () => {
  localStorage.removeItem(KEY);
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(OPTIONS_KEY);
};
