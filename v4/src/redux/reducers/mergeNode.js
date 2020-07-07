import { ACTION_TYPES } from '../actions';

export default function mergingNode(state = null, action) {
  switch (action.type) {
    case ACTION_TYPES.SELECT_MERGE_NODE:
      return action.node;
    default:
      return state;
  }
}
