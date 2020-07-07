import { NTYPE } from './types';

export default function calcCurrNode(node) {
  let neighbors = [node.data()];

  if (node.data('node_type') === NTYPE.TOPIC) {
    neighbors = node.incomers((el) => el.isNode())
      .map((neighbor) => neighbor.data());
  }

  return {
    id: node.id(),
    data: node.data(),
    neighbors,
  };
}
