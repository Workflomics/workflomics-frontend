import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { TaxParameter, WorkflowConfig } from '../../stores/WorkflowTypes';
import { useStore } from '../../store';
import { InputsOutputSelection } from './InputOutputSelection';
import { Link } from 'react-router-dom';
import { DataTax } from '../../stores/DataTaxStore';
import { runInAction } from 'mobx';


const InputsOutputs: React.FC<any> = observer((props) => {
  let { exploreDataStore } = useStore();
  const workflowConfig: WorkflowConfig = exploreDataStore.workflowConfig;
  let { dataTaxStore } = useStore();
  const dataTaxs: Map<string, DataTax> = dataTaxStore.availableDataTax;

  React.useEffect(() => {
    if (workflowConfig.domain !== undefined) {
      dataTaxStore.fetchData(workflowConfig.domain.repo_url);
    }
  }, [dataTaxStore, workflowConfig.domain]);

  const addInput = () => {
    runInAction(() => {
      workflowConfig.inputs.push(dataTaxStore.getEmptyTaxParameter());
    });
  };

  const removeInput = () => {
    runInAction(() => {
      workflowConfig.inputs.pop();
    });
  };

  const addOutput = () => {
    runInAction(() => {
      workflowConfig.outputs.push(dataTaxStore.getEmptyTaxParameter());
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
          ["data_0006", { id: "data_0943", label: "Mass spectrum", root: "data_0006" }],
          ["format_1915", { id: "format_3244", label: "mzML", root: "format_1915" }],
        ]),
        new Map([
          ["data_0006", { id: "data_2976", label: "Protein sequence", root: "data_0006" }],
          ["format_1915", { id: "format_1929", label: "FASTA", root: "format_1915" }],
        ]),
      ]
      workflowConfig.outputs = [
        new Map([
          ["data_0006", { id: "data_0006", label: "Data", root: "data_0006" }],
          ["format_3747", { id: "format_3747", label: "protXML", root: "format_1915" }],
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
          {dataTaxStore.isLoading && <div className="alert alert-info">Loading data taxonomy...</div>}
          {workflowConfig.domain === undefined && <div className="alert alert-error">Domain could not be retrieved</div>}
          {dataTaxStore.error && <div className="alert alert-error">Data taxonomy could not be retrieved ({dataTaxStore.error})</div>}

          {/* Inputs */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32">Inputs</span>
            <div className="flex flex-grow items-center">
              {workflowConfig.inputs.map((input: TaxParameter, index: number) => {
                return (<InputsOutputSelection key={index} value={input} dataTaxs={dataTaxs} />)
              })}
              <button className="btn m-1 w-12 h-12 text-lg" onClick={() => addInput()}>+</button>
              <button className="btn m-1 w-12 h-12 text-lg" onClick={() => removeInput()}>-</button>
            </div>
          </div>

          {/* Outputs */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32">Outputs</span>
            <div className="flex flex-grow items-center">
              {workflowConfig.outputs.map((output: TaxParameter, index: number) => {
                return (<InputsOutputSelection key={index} value={output} dataTaxs={dataTaxs} />)
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
