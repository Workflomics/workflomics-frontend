import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { TreeNode, TreeSelectionBox } from '../TreeSelectionBox';
import { runInAction } from 'mobx';
import { ApeTaxTuple } from '../../stores/TaxStore';
import { isInaccessible } from '@testing-library/react';

interface InputsOutputSelectionProps {
  taxParam: any;
  dataTax: ApeTaxTuple;
}

const InputsOutputSelection: React.FC<InputsOutputSelectionProps> = observer(({ taxParam, dataTax }) => {

  const onTypeChange = (node: TreeNode) => {
    runInAction(() => {
      if (taxParam.root === "http://edamontology.org/data_0006") {
        taxParam[0] = node;
      } else {
        taxParam[1] = node;
      }
      console.log("Node:", node.label)
    });
  };


  return (
    <div>
      {
        Array.from(dataTax.values()).map((paramClass) => {
          // try {
          const keys = dataTax.keys;
          const keysSize = dataTax.keys.length;
          const x = dataTax.values();

          let val;
          console.log("classa:", paramClass.id);
          if (paramClass.id === "http://edamontology.org/data_0006") {
            console.log("Type");
            val = taxParam[0];
          } else {
            console.log("Format");
            val = taxParam[1];
          }

          return (
            <TreeSelectionBox
              key={paramClass.id}
              nodes={dataTax.get(paramClass.root)!.subsets}
              value={taxParam}
              root={paramClass.id}
              onChange={(node: TreeNode) => onTypeChange(node)}
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
