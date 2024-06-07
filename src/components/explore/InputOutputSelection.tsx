import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { TreeNode, TreeSelectionBox } from '../TreeSelectionBox';
import { runInAction } from 'mobx';
import taxStore, { ApeTaxTuple } from '../../stores/TaxStore';

interface InputsOutputSelectionProps {
  parameterTuple: ApeTaxTuple;
  dataTaxonomy: ApeTaxTuple;
}

const InputsOutputSelection: React.FC<InputsOutputSelectionProps> = observer(({ parameterTuple, dataTaxonomy }) => {

  const onTypeChange = (root: string, node: TreeNode) => {
    runInAction(() => {
      parameterTuple[root] = node;
    });
  };

  return (
    <div className="tooltip tooltip-bottom"
    data-tip="Specify data type and format as concrete as possible.">
      {
        Object.values(dataTaxonomy).map((paramClass) => {
          // try {
          return (
            <TreeSelectionBox
              key={paramClass.id}
              nodes={paramClass.subsets}
              value={parameterTuple ? parameterTuple[paramClass.id] : taxStore.getEmptyTaxParameter(taxStore.availableDataTax)}
              root={paramClass.id}
              onChange={(node: TreeNode) => onTypeChange(paramClass.id, node)}
              placeholder={paramClass.label}
            />
          );
          // } catch (error) {
          //   console.error("Error occurred:", error);
          //   return null; // or some placeholder component
          // }
        })}
    </div>
  );

});

export { InputsOutputSelection };
