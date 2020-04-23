// eslint-disable-line
import Log from '../log';

const TAG = 'storage.blockstack';

const loadBlockstackGraph = (userSession, loadUsername, filename, onSuccess, onError) => {
  Log.info('GOT FUNCTIONS', onSuccess, onError);
  Log.info(TAG, 'Loading', loadUsername, "'s data");
  const options = { decrypt: false, username: loadUsername };
  userSession.getFile(filename, options)
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

export default loadBlockstackGraph;
