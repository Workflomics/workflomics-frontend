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
      workflowConfig.inputs.push(taxStore.getEmptyTaxParameter(taxStore.availableDataTax));
    });
  };

  const removeInput = () => {
    runInAction(() => {
      workflowConfig.inputs.pop();
    });
  };

  const addOutput = () => {
    runInAction(() => {
      workflowConfig.outputs.push(taxStore.getEmptyTaxParameter(taxStore.availableDataTax));
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
        {
          "http://edamontology.org/data_0006": { id: "http://edamontology.org/data_0943", label: "Mass spectrum", root: "http://edamontology.org/data_0006", subsets: [] },
          "http://edamontology.org/format_1915": { id: "http://edamontology.org/format_3244", label: "mzML", root: "http://edamontology.org/format_1915", subsets: [] },
        },
        {
          "http://edamontology.org/data_0006": { id: "http://edamontology.org/data_2976", label: "Protein sequence", root: "http://edamontology.org/data_0006", subsets: [] },
          "http://edamontology.org/format_1915": { id: "http://edamontology.org/format_1929", label: "FASTA", root: "http://edamontology.org/format_1915", subsets: [] },
        }
      ]
      workflowConfig.outputs = [
        {
          "http://edamontology.org/data_0006": { id: "http://edamontology.org/data_3753", label: "Over-representation data", root: "http://edamontology.org/data_0006", subsets: [] },
          "http://edamontology.org/format_1915": { id: "http://edamontology.org/format_3464", label: "JSON", root: "http://edamontology.org/format_1915", subsets: [] },
        }
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
              {workflowConfig.inputs.map((input: ApeTaxTuple, index: number) => {
                return (<InputsOutputSelection key={index} parameterTuple={input} dataTaxonomy={allDataTax} />)
              })}
              <div className="tooltip tooltip-bottom" data-tip="Add an additional input file.">
                <button className="btn m-1 w-12 h-12 text-lg" onClick={() => addInput()}>+</button>
              </div>
              <div className="tooltip tooltip-bottom" data-tip="Remove the last input file.">
                <button className="btn m-1 w-12 h-12 text-lg" onClick={() => removeInput()}>-</button>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="flex items-center space-x-4">
              <span className="text-3xl flex-grow-0 w-32">Outputs</span>
            <div className="flex flex-grow items-center">
              {workflowConfig.outputs.map((output: ApeTaxTuple, index: number) => {
                return (<InputsOutputSelection key={index} parameterTuple={output} dataTaxonomy={allDataTax} />)
              })}
              <div className="tooltip tooltip-bottom" data-tip="Add an additional output file.">
                <button className="btn m-1 w-12 h-12 text-lg" onClick={() => addOutput()}>+</button>
              </div>
              <div className="tooltip tooltip-bottom" data-tip="Remove the last output file.">
                <button className="btn m-1 w-12 h-12 text-lg" onClick={() => removeOutput()}>-</button>
                </div>
            </div>
          </div>

          {/* Button for demo data */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32"></span>
            <div className="flex flex-grow items-center">
            <div className="tooltip" data-tip="Fill in the form with the inputs and outputs used in our demo example.">
                <button className="btn m-1" onClick={() => useDemoData()}>Load example</button>
            </div>
            </div>
          </div>

          {/* Next button */}
          <div className="flex flex-row-reverse p-10">
          <div className="tooltip tooltip-left" data-tip="Go to the next step.">
              <Link to="/explore/constraints"><button className="btn btn-primary">Next</button></Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export { InputsOutputs };
