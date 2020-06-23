import { ACTION_TYPES } from '../actions';

export default function selected(state = null, action) {
  switch (action.type) {
    case ACTION_TYPES.SELECT_NODE:
      return action.node;
    default:
      return state;
  }
}
