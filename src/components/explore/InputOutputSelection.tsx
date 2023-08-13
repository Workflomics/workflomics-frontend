import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { TreeNode, TreeSelectionBox } from '../TreeSelectionBox';
import { runInAction } from 'mobx';
import { ApeTaxTuple } from '../../stores/TaxStore';

interface InputsOutputSelectionProps {
  taxParam: ApeTaxTuple;
  dataTax: ApeTaxTuple;
}

const InputsOutputSelection: React.FC<InputsOutputSelectionProps> = observer(({ taxParam, dataTax }) => {

  const onTypeChange = (node: TreeNode, root: string) => {
    runInAction(() => {
      taxParam.set(root, node);
    });
  };


  return (
    <div>
      {
        Array.from(dataTax.values()).map((paramClass) => {
          // try {
          return (
            <TreeSelectionBox
              key={paramClass.id}
              nodes={dataTax.get(paramClass.id)!.subsets}
              value={paramClass}
              onChange={(node: TreeNode) => onTypeChange(node, paramClass.root)}
              placeholder={paramClass.label}
            />
          );
          // } catch (error) {
          //   console.error("Error occurred:", error);
          //   console.log("Key:", key, "\n", "Data:", data, "TaxParam:", taxParam);
          //   return null; // or some placeholder component
          // }
        })}
    </div>
  );

});

export { InputsOutputSelection };
