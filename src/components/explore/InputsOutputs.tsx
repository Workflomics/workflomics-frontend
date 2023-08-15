import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { WorkflowConfig } from '../../stores/WorkflowTypes';
import { useStore } from '../../store';
import { InputsOutputSelection } from './InputOutputSelection';
import { Link } from 'react-router-dom';
import { runInAction } from 'mobx';
import { ApeTaxTuple } from '../../stores/TaxStore';


const InputsOutputs: React.FC<any> = observer((props) => {
  let { exploreDataStore } = useStore();
  const workflowConfig: WorkflowConfig = exploreDataStore.workflowConfig;
  let { taxStore } = useStore();
  const allDataTax: ApeTaxTuple = taxStore.availableDataTax;

  React.useEffect(() => {
    if (workflowConfig.domain !== undefined) {
      taxStore.fetchDataDimensions(workflowConfig.domain.repo_url);
    }
  }, [taxStore, workflowConfig.domain]);

  const addInput = () => {
    runInAction(() => {
      workflowConfig.inputs.push(taxStore.getEmptyTaxParameter());
    });
  };

  const removeInput = () => {
    runInAction(() => {
      workflowConfig.inputs.pop();
    });
  };

  const addOutput = () => {
    runInAction(() => {
      workflowConfig.outputs.push(taxStore.getEmptyTaxParameter());
    });
  };

  const removeOutput = () => {
    runInAction(() => {
      workflowConfig.outputs.pop();
    });
  };


  const useDemoData = () => {
    runInAction(() => {
      workflowConfig.inputs = [
        new Map([
          ["http://edamontology.org/data_0006", { id: "http://edamontology.org/data_0943", label: "Mass spectrum", root: "http://edamontology.org/data_0006" }],
          ["http://edamontology.org/format_1915", { id: "http://edamontology.org/format_3244", label: "mzML", root: "http://edamontology.org/format_1915" }],
        ]),
        new Map([
          ["http://edamontology.org/data_0006", { id: "http://edamontology.org/data_2976", label: "Protein sequence", root: "http://edamontology.org/data_0006" }],
          ["http://edamontology.org/format_1915", { id: "http://edamontology.org/format_1929", label: "FASTA", root: "http://edamontology.org/format_1915" }],
        ]),
      ]
      workflowConfig.outputs = [
        new Map([
          ["http://edamontology.org/data_0006", { id: "http://edamontology.org/data_0006", label: "Data", root: "http://edamontology.org/data_0006" }],
          ["http://edamontology.org/format_3747", { id: "http://edamontology.org/format_3747", label: "protXML", root: "http://edamontology.org/format_1915" }],
        ]),
      ];
    });
  };

  return (
    <div>

      <ExplorationProgress index={1} />

      <div className="m-8">
        <div className="text-left space-y-6 mt-10">

          {/* Status messages */}
          {taxStore.isLoading && <div className="alert alert-info">Loading data taxonomy...</div>}
          {workflowConfig.domain === undefined && <div className="alert alert-error">Domain could not be retrieved</div>}
          {taxStore.error && <div className="alert alert-error">Data taxonomy could not be retrieved ({taxStore.error})</div>}

          {/* Inputs */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32">Inputs</span>
            <div className="flex flex-grow items-center">
              {workflowConfig.inputs.map((input: ApeTaxTuple, index: number, array: ApeTaxTuple[]) => {
                console.log("Ins:", workflowConfig.inputs.length)
                return (<InputsOutputSelection key={index} parameterPair={input} dataTaxonomy={allDataTax} />)
              })}
              <button className="btn m-1 w-12 h-12 text-lg" onClick={() => addInput()}>+</button>
              <button className="btn m-1 w-12 h-12 text-lg" onClick={() => removeInput()}>-</button>
            </div>
          </div>

          {/* Outputs */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32">Outputs</span>
            <div className="flex flex-grow items-center">
              {workflowConfig.outputs.map((output: ApeTaxTuple, index: number, array: ApeTaxTuple[]) => {
                console.log("Outs:", workflowConfig.outputs.length)
                console.log("Array", output instanceof Array);
                console.log("Map", output instanceof Map);
                console.log(output)
                return (<InputsOutputSelection key={index} parameterPair={output} dataTaxonomy={allDataTax} />)
              })}
              <button className="btn m-1 w-12 h-12 text-lg" onClick={() => addOutput()}>+</button>
              <button className="btn m-1 w-12 h-12 text-lg" onClick={() => removeOutput()}>-</button>
            </div>
          </div>

          {/* Button for demo data */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32"></span>
            <div className="flex flex-grow items-center">
              <button className="btn m-1" onClick={() => useDemoData()}>Use demo data</button>
            </div>
          </div>

          {/* Next button */}
          <div className="flex flex-row-reverse p-10">
            <Link to="/explore/constraints"><button className="btn btn-primary">Next</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export { InputsOutputs };
