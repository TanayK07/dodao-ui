// Tree.tsx
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { TreeNode, TreeNodeType } from './TreeNode';

interface TreeProps {
  data: TreeNodeType[];
  activeKey?: string | undefined;
  setActiveKey?: Dispatch<SetStateAction<string | undefined>>;
}

const Tree: React.FC<TreeProps> = ({ data, activeKey, setActiveKey }) => {
  const [openNodes, setOpenNodes] = useState<{ [key: string]: string }>({});

  return (
    <div>
      {data.map((node) => (
        <TreeNode key={node.component.key as string} node={node} openNodes={openNodes} setOpenNodes={setOpenNodes} level={1} />
      ))}
    </div>
  );
};
export { Tree };  export type { TreeProps };

