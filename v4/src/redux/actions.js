export const ACTION_TYPES = {
    ADD_NODE: 'ADD_NODE',
    EDIT_NODE: 'EDIT_NODE',
    DELETE_NODE: 'DELETE_NODE',
    MERGE_NODE: 'MERGE_NODE'
}

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
