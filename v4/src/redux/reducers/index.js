import { combineReducers } from 'redux';
import graph from './graph';
import selected from './selected';
import mergingNode from './mergeNode';

export default combineReducers({
  graph,
  selected,
  mergingNode,
});
