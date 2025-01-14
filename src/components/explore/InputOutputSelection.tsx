import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import taxStore, { ApeTaxTuple, TaxonomyClass } from '../../stores/TaxStore';
import OntologyTreeSelect from '../OntologyTreeSelect';

interface InputsOutputSelectionProps {
  parameterTuple: ApeTaxTuple;
  dataTaxonomy: ApeTaxTuple;
}

const InputsOutputSelection: React.FC<InputsOutputSelectionProps> = observer(({ parameterTuple, dataTaxonomy }) => {

  const onTypeChange = (root: string, node: TaxonomyClass | null) => {
    if (node === null) {
      return;
    }
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
            <OntologyTreeSelect
              key={paramClass.id}
              ontology={paramClass}
              value={parameterTuple ? parameterTuple[paramClass.id] : taxStore.copyTaxonomyClass(paramClass)}
              setValue={(value: TaxonomyClass | null) => onTypeChange(paramClass.id, value)}
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
