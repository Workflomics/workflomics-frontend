import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { TreeNode, TreeSelectionBox } from '../TreeSelectionBox';

const InputsOutputSelection: React.FC<any> = observer(({value, dataTaxs}) => {

  const onTypeChange = (node: TreeNode) => {
    value[0] = {id: node.id, label: node.label}
  };

  const onFormatChange = (node: TreeNode) => {
    value[1] = {id: node.id, label: node.label}
  };

  return (
    <div>
      {dataTaxs.length > 0 && <TreeSelectionBox nodes={dataTaxs[0].subsets} value={value[0]}
        onChange={(node: TreeNode) => onTypeChange(node)} placeholder="Type" />}
      {dataTaxs.length > 0 && <TreeSelectionBox nodes={dataTaxs[1].subsets} value={value[1]}
        onChange={(node: TreeNode) => onFormatChange(node)} placeholder="Format" />}
    </div>
  );
});

export { InputsOutputSelection };
