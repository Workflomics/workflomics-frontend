import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { InputOutputFormats, InputOutputTypes, WorkflowConfig } from '../../stores/WorkflowTypes';
import { useStore } from '../../store';
import { InputsOutputSelection } from './InputOutputSelection';
import { Link } from 'react-router-dom';


const InputsOutputs: React.FC<any> = observer((props) => {
  let { exploreDataStore } = useStore();
  const workflowConfig: WorkflowConfig = exploreDataStore.workflowConfig;
  
  const addInput = () => workflowConfig.inputs.push([{id:"",label:""}, {id:"",label:""}]);
  const addOutput = () => workflowConfig.outputs.push([{id:"",label:""}, {id:"",label:""}]);

  return (
    <div>

      <ExplorationProgress index={1} />

      <div className="m-8">
        <div className="overflow-x-auto text-left space-y-6 mt-10">

          {/* Inputs */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32">Inputs</span>
            <div className="flex flex-grow items-center">
              { workflowConfig.inputs.map((input: [InputOutputTypes | undefined, InputOutputFormats | undefined], index:number) => {
                  return (<InputsOutputSelection key={index} value={input} />)
                })}
              <button className="btn" onClick={() => addInput()}>+</button>
            </div>
          </div>

          {/* Outputs */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32">Outputs</span>
            <div className="flex flex-grow items-center">
              { workflowConfig.outputs.map((output: [InputOutputTypes | undefined, InputOutputFormats | undefined], index:number) => {
                  return (<InputsOutputSelection key={index} value={output} />)
                })}
              <button className="btn" onClick={() => addOutput()}>+</button>
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
