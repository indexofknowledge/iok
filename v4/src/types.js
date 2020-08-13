// eslint-disable-line

/** Types of storage backends */
export const STORAGE_TYPES = {
  BLOCKSTACK: 'blockstack',
  IPFS: 'ipfs',
};

/** Types of nodes on the graph */
export const NTYPE = {
  TOPIC: 1,
  RESO: 2,
};

/** Types of resources on the graph */
export const RTYPE = {
  DESC: 1,
  LINK: 4,
};

export const NPAIR = {
  TOPIC: [NTYPE.TOPIC, null],
  DESC: [NTYPE.RESO, RTYPE.DESC],
  LINK: [NTYPE.RESO, RTYPE.LINK],
}

/** Types of graph import formats */
export const IMPORT_TYPES = {
  BLOCKSTACK: 'blockstack',
  IPFS: 'ipfs',
  LINK: 'link',
  FILE: 'file',
}

/** Types of tools available for selection */
export const TOOL_TYPES = {
  ADD: 'add_node',
  EDIT: 'edit_node',
  MERGE: 'merge_node',
  DELETE: 'delete_node',
  IMPORT: 'import',
}
