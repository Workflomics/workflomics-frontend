import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import taxStore, { ApeTaxTuple, TaxonomyClass } from '../../stores/TaxStore';
import OntologyTreeSelect from '../OntologyTreeSelect';
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";

interface InputsOutputSelectionProps {
  parameterTuple: ApeTaxTuple;
  dataTaxonomy: ApeTaxTuple;
  removeEntry: () => void;
}

const InputsOutputSelection: React.FC<InputsOutputSelectionProps> = observer(({ parameterTuple, dataTaxonomy, removeEntry }) => {

  const onTypeChange = (root: string, value: TaxonomyClass | null) => {
    if (value === null) {
      return;
    }
    runInAction(() => {
      parameterTuple[root] = value;
    });
  };

  const removeButton = () => (
    <button
      className="remove-button btn btn-square btn-outline btn-sm"
      style={{ position: "absolute", top: "4px", right: "-10px", zIndex: 10, border: "none"}}
      onClick={() => { removeEntry(); }} >
        <Icon path={mdiClose} size={1} />
    </button>
  );

  return (
    <div className="remove-button-container tooltip tooltip-bottom flex flex-col space-y-2 w-64 relative"
    data-tip="Specify data type and format as concrete as possible.">
      { removeButton() }
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
