// eslint-disable-line
import Log from '../log';
import { GRAPH_FILENAME } from '../constants';

const TAG = 'storage.blockstack';

export const loadBlockstackGraph = (userSession, loadUsername, onSuccess, onError) => {
  console.info('GOT FUNCTIONS', onSuccess, onError);
  console.info(TAG, 'Loading', loadUsername, "'s data");
  const options = { decrypt: false, username: loadUsername };
  userSession.getFile(GRAPH_FILENAME, options)
    .then((content) => {
      if (content && content.length > 0) {
        const graph = JSON.parse(content);
        onSuccess(graph);
      } else {
        onError();
      } // deal with fail and err as same
    }).catch((err) => {
      onError(err);
    });
};

export const saveBlockstackGraph = (graph, userSession) => {
  console.info(TAG, 'SAVING...', graph);
  return userSession
    .putFile(GRAPH_FILENAME, JSON.stringify(graph), { encrypt: false })
    .finally(() => {
      console.info('Saved');
    });
};
