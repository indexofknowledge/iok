export const ACTION_TYPES = {
  ADD_NODE: 'ADD_NODE',
  EDIT_NODE: 'EDIT_NODE',
  DELETE_NODE: 'DELETE_NODE',
  MERGE_NODE: 'MERGE_NODE',
  CONNECT_NODE: 'CONNECT_NODE',
  SELECT_NODE: 'SELECT_NODE',
  SELECT_MERGE_NODE: 'SELECT_MERGE_NODE',
  TOGGLE_NODE_TRAVERSED: 'TOGGLE_NODE_TRAVERSED',
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

export const connectNode = (childId, newParentId) => ({
  type: ACTION_TYPES.CONNECT_NODE,
  childId,
  newParentId,
});

export const selectNode = (nodeId) => ({
  type: ACTION_TYPES.SELECT_NODE,
  nodeId,
});

export const selectPrevNode = (nodeId) => ({
  type: ACTION_TYPES.SELECT_MERGE_NODE,
  nodeId,
});

export const toggleNodeTraversed = (nodeId) => ({
  type: ACTION_TYPES.TOGGLE_NODE_TRAVERSED,
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
