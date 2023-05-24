import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { InputOutputFormats, InputOutputTypes, WorkflowConfig } from '../../stores/WorkflowTypes';
import { useStore } from '../../store';
import { InputsOutputSelection } from './InputOutputSelection';


const InputsOutputs: React.FC<any> = observer((props) => {
  let { exploreDataStore } = useStore();
  const workflowConfig: WorkflowConfig = exploreDataStore.workflowConfig;
  
  const addInput = () => workflowConfig.inputs.push([undefined, undefined]);
  const addOutput = () => workflowConfig.outputs.push([undefined, undefined]);

  return (
    <div>

      <ExplorationProgress index={1} />

      <div className="m-8">
        <div className="overflow-x-auto text-left">

          <div>
            <span>Inputs:</span>
            { workflowConfig.inputs.map((input: [InputOutputTypes | undefined, InputOutputFormats | undefined], index:number) => {
                return (<InputsOutputSelection key={index} value={input} />)
              })}
            <button className="btn" onClick={() => addInput()}>Add input</button>
          </div>

          <div>
            <span>Outputs:</span>
            { workflowConfig.outputs.map((output: [InputOutputTypes | undefined, InputOutputFormats | undefined], index:number) => {
                return (<InputsOutputSelection key={index} value={output} />)
              })}
            <button className="btn" onClick={() => addOutput()}>Add output</button>
          </div>
        </div>
      </div>
    </div>
  );
});

export { InputsOutputs };
