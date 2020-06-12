export const addNode = (parentId, props) => ({
  type: 'ADD_NODE',
  parentId,
  props,
});

export const editNode = (id, props) => ({
  type: 'EDIT_NODE',
  id,
  props,
});

export const deleteNode = (id) => ({
  type: 'DELETE_NODE',
  id,
});

export const mergeNode = (fromId, toId) => ({
  type: 'MERGE_NODE',
  fromId,
  toId,
});
