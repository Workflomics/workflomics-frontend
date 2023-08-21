import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { TreeNode, TreeSelectionBox } from '../TreeSelectionBox';
import { runInAction } from 'mobx';
import taxStore, { ApeTaxTuple } from '../../stores/TaxStore';

interface InputsOutputSelectionProps {
  parameterPair: ApeTaxTuple;
  dataTaxonomy: ApeTaxTuple;
}

const InputsOutputSelection: React.FC<InputsOutputSelectionProps> = observer(({ parameterPair, dataTaxonomy }) => {

  const onTypeChange = (root: string, node: TreeNode) => {
    runInAction(() => {
      parameterPair[root] = node;
    });
  };

  return (
    <div>
      {
        Object.values(dataTaxonomy).map((paramClass) => {
          // try {
          const temp = parameterPair;
          console.log("M ", temp instanceof Map)
          console.log("A ", temp instanceof Array)

          return (
            <TreeSelectionBox
              key={paramClass.id}
              nodes={paramClass.subsets}
              value={parameterPair ? parameterPair[paramClass.id] : taxStore.getEmptyTaxParameter()}
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
