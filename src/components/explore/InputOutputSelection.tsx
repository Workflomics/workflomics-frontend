import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { TreeNode, TreeSelectionBox } from '../TreeSelectionBox';
import { runInAction } from 'mobx';
import { ApeTaxTuple } from '../../stores/TaxStore';
import { isInaccessible } from '@testing-library/react';

interface InputsOutputSelectionProps {
  parameterPair: ApeTaxTuple;
  dataTaxonomy: ApeTaxTuple;
}

const InputsOutputSelection: React.FC<InputsOutputSelectionProps> = observer(({ parameterPair, dataTaxonomy }) => {

  const onTypeChange = (node: TreeNode) => {
    runInAction(() => {
      parameterPair.set(node.root, node);
    });
  };


  return (
    <div>
      {
        Array.from(dataTaxonomy.values()).map((paramClass) => {
          // try {
          const temp = parameterPair;
          console.log("M ", temp instanceof Map)
          console.log("A ", temp instanceof Array)
          return (
            <TreeSelectionBox
              key={paramClass.id}
              nodes={paramClass.subsets}
              value={parameterPair}
              root={paramClass.id}
              onChange={(node: TreeNode) => onTypeChange(node)}
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
