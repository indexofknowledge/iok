export const ACTION_TYPES = {
  ADD_NODE: 'ADD_NODE',
  EDIT_NODE: 'EDIT_NODE',
  DELETE_NODE: 'DELETE_NODE',
  MERGE_NODE: 'MERGE_NODE',
  CONNECT_NODE: 'CONNECT_NODE',
  SELECT_NODE: 'SELECT_NODE',
  SELECT_MERGE_NODE: 'SELECT_MERGE_NODE',
  UPLOAD_GRAPH: 'UPLOAD_GRAPH',
  IMPORT_GRAPH: 'IMPORT_GRAPH',

};

export const addNode = (parentId, props) => ({
  type: ACTION_TYPES.ADD_NODE,
  parentId,
  props,
});

export const editNode = (id, props) => ({
  type: ACTION_TYPES.EDIT_NODE,
  id,
  props,
});

export const deleteNode = (id) => ({
  type: ACTION_TYPES.DELETE_NODE,
  id,
});

export const mergeNode = (fromId, toId) => ({
  type: ACTION_TYPES.MERGE_NODE,
  fromId,
  toId,
});

export const connectNode = (childId, newParentID) => ({
  type: ACTION_TYPES.CONNECT_NODE,
  childId,
  newParentID,
});

export const selectNode = (nodeId) => ({
  type: ACTION_TYPES.SELECT_NODE,
  nodeId,
});

export const selectMergeNode = (nodeId) => ({
  type: ACTION_TYPES.SELECT_MERGE_NODE,
  nodeId,
});

export const uploadGraph = (graph) => ({
  type: ACTION_TYPES.UPLOAD_GRAPH,
  graph,
});

export const importGraph = (graph) => ({
  type: ACTION_TYPES.IMPORT_GRAPH,
  graph,
});
