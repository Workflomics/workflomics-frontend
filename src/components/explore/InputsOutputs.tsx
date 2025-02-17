import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { UserParams } from '../../stores/WorkflowTypes';
import { useStore } from '../../store';
import { InputsOutputSelection } from './InputOutputSelection';
import { Link } from 'react-router-dom';
import { runInAction } from 'mobx';
import { ApeTaxTuple } from '../../stores/TaxStore';


const InputsOutputs: React.FC<any> = observer((props) => {
  let { exploreDataStore } = useStore();
  const userParams: UserParams = exploreDataStore.userParams;
  let { taxStore } = useStore();
  const allDataTax: ApeTaxTuple = taxStore.availableDataTax;

  React.useEffect(() => {
    if (userParams.domain !== undefined) {
      taxStore.fetchDataDimensions(userParams.domain.repo_url);
    }
  }, [taxStore, userParams.domain]);

  const addInput = () => {
    runInAction(() => {
      userParams.inputs.push(taxStore.getEmptyTaxParameter(taxStore.availableDataTax));
    });
  };

  const removeInput = (index: number) => {
    runInAction(() => {
      userParams.inputs.splice(index, 1);
    });
  };

  const addOutput = () => {
    runInAction(() => {
      userParams.outputs.push(taxStore.getEmptyTaxParameter(taxStore.availableDataTax));
    });
  };

  const removeOutput = (index: number) => {
    runInAction(() => {
      userParams.outputs.splice(index, 1);
    });
  };

  const useDemoData = () => {
    runInAction(() => {
      userParams.inputs = [
        {
          "http://edamontology.org/data_0006": { id: "http://edamontology.org/data_0943", label: "Mass spectrum", root: "http://edamontology.org/data_0006", subsets: [] },
          "http://edamontology.org/format_1915": { id: "http://edamontology.org/format_3244", label: "mzML", root: "http://edamontology.org/format_1915", subsets: [] },
        },
        {
          "http://edamontology.org/data_0006": { id: "http://edamontology.org/data_2976", label: "Protein sequence", root: "http://edamontology.org/data_0006", subsets: [] },
          "http://edamontology.org/format_1915": { id: "http://edamontology.org/format_1929", label: "FASTA", root: "http://edamontology.org/format_1915", subsets: [] },
        }
      ];
      userParams.outputs = [
        {
          "http://edamontology.org/data_0006": { id: "http://edamontology.org/data_3753", label: "Over-representation data", root: "http://edamontology.org/data_0006", subsets: [] },
          "http://edamontology.org/format_1915": { id: "http://edamontology.org/format_3464", label: "JSON", root: "http://edamontology.org/format_1915", subsets: [] },
        }
      ];
      // // Make a copy of the default inputs in the domain config
      // const config = exploreDataStore.domainConfig;
      // if (config === undefined) {
      //   return;
      // }
      // userParams.inputs = JSON.parse(JSON.stringify(config.inputs));
      // userParams.outputs = JSON.parse(JSON.stringify(config.outputs));
    });
  };

  return (
    <div>

      <ExplorationProgress index={1} />

      <div className="m-8">
        <div className="text-left space-y-6 mt-10">

          {/* Status messages */}
          {taxStore.isLoading && <div className="alert alert-info">Loading data taxonomy...</div>}
          {userParams.domain === undefined && <div className="alert alert-error">Domain could not be retrieved</div>}
          {taxStore.error && <div className="alert alert-error">Data taxonomy could not be retrieved ({taxStore.error})</div>}

          {/* Inputs */}
          <div className="flex items-center space-x-4">
              <span className="text-3xl flex-grow-0 w-32">Inputs</span>
            <div className="flex flex-grow items-center flex-row space-x-4 w-50">
              {userParams.inputs.map((input: ApeTaxTuple, index: number) => {
                return (<InputsOutputSelection
                    key={index}
                    parameterTuple={input}
                    dataTaxonomy={allDataTax}
                    removeEntry={() => removeInput(index)}/>)
              })}
              {/* "Add input" button */}
              <div className="tooltip tooltip-bottom" data-tip="Add an additional input file.">
                <button className="btn m-1 w-12 h-12 text-lg mt-0" onClick={() => addInput()}>+</button>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="flex items-center space-x-4">
              <span className="text-3xl flex-grow-0 w-32">Outputs</span>
            <div className="flex flex-grow items-center flex-row space-x-4">
              {userParams.outputs.map((output: ApeTaxTuple, index: number) => {
                return (<InputsOutputSelection
                  key={index}
                  parameterTuple={output}
                  dataTaxonomy={allDataTax}
                  removeEntry={() => removeOutput(index)}/>)
              })}
              {/* "Add output" button */}
              <div className="tooltip tooltip-bottom" data-tip="Add an additional output file.">
                <button className="btn m-1 w-12 h-12 text-lg mt-0" onClick={() => addOutput()}>+</button>
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
