import { createMatcher } from './createMatcher';
import { insertNode } from './insertNode';

type Options = IInsertAtData | IInsertAtData[];

export interface INode {
  tag?: string;
  attrs?: {
    id?: string;
    class?: string;
  };
  content?: INode[];
}

interface ITree {
  walk: any;
  match: (matcher: INode | INode[], node: (node: INode) => INode) => void;
}

export interface IInsertAtData {
  selector: string;
  behavior?: 'inside' | 'outside';
  append?: string;
  prepend?: string;
}

export default function(options: Options) {
  return function insertAt(tree: ITree) {
    const opts = Array.isArray(options) ? options : [options];

    opts.forEach(option => {
      const matcher = createMatcher(option.selector.trim());
      const behavior = option.behavior || 'inside';

      if (behavior === 'inside') {
        tree.match(matcher, node => {
          return insertNode({ node, option, content: [node.content as INode] });
        });
      } else if (behavior === 'outside') {
        let siblingNode = {};

        tree.match(matcher, node => {
          siblingNode = node;
          return node;
        });

        tree.match({ content: [matcher] }, node => {
          return insertNode({ node, option, content: [siblingNode] });
        });
      }
    });
  };
}
