import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { TreeNode, TreeSelectionBox } from '../TreeSelectionBox';
import { runInAction } from 'mobx';
import { DataTax } from '../../stores/DataTaxStore';
import { TaxParameter } from '../../stores/WorkflowTypes';

interface InputsOutputSelectionProps {
  value: TaxParameter;
  dataTaxs: Map<string, DataTax>;
}

const InputsOutputSelection: React.FC<InputsOutputSelectionProps> = observer(({ value, dataTaxs }) => {

  const onTypeChange = (node: TreeNode, root: string) => {
    runInAction(() => {
      value.set(root, node.getTaxonomyClass(root));
    });
  };


  return (
    <div>
      {Array.from(dataTaxs.entries()).map(([key, data]) => (
        <TreeSelectionBox
          key={key}
          nodes={data}
          value={value.get(key)}

          onChange={(node: TreeNode) => onTypeChange(node, key)}
          placeholder={data.label}
        />
      ))}
    </div>
  );

});

export { InputsOutputSelection };
