import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { Link, useNavigate } from 'react-router-dom';
import { WorkflowConfig } from '../../stores/WorkflowTypes';
import { useStore } from '../../store';

const GenerationConfig: React.FC<any> = observer((props) => {
  let { exploreDataStore } = useStore();
  const workflowConfig: WorkflowConfig = exploreDataStore.workflowConfig;
  const navigate = useNavigate();

  const runSynthesis = () => {
    exploreDataStore.runSynthesis(workflowConfig);
    navigate('/explore/results');
  };

  return (
    <div>

      <ExplorationProgress index={3} />

      <div className="m-8">
        <div className="overflow-x-auto text-left space-y-6 mt-10">

          {/* Configuration */}
          <div className="flex items-center space-x-4">
          <div className="tooltip tooltip-right" data-tip="Specify the parameters of the automated workflow generation process.">
              <h2 className="text-3xl w-80 m-4">Configuration</h2>
              </div>
            <div className="flex flex-col m-4">
              <div className="flex items-center m-2 tooltip tooltip-bottom"
                    data-tip="Specify minimal number of operations you expect in the desired workflow.">
                  <label className="w-80 text-lg">Min # of steps</label>
                <input
                  type="number"
                  className="input input-bordered w-full max-w-xs"
                  value={workflowConfig.minSteps.toString()}
                  onChange={(event) => (workflowConfig.minSteps = parseInt(event.target.value))}
                />
              </div>
                <div className="flex items-center m-2 tooltip tooltip-bottom"
                    data-tip="Specify maximum number of operations you expect in the desired workflow.">
                  <label className="w-80 text-lg">Max # of steps</label>
                <input
                  type="number"
                  className="input input-bordered w-full max-w-xs"
                  value={workflowConfig.maxSteps.toString()}
                  onChange={(event) => (workflowConfig.maxSteps = parseInt(event.target.value))}
                />
              </div>
                  <div className="flex items-center m-2 tooltip tooltip-bottom"
                    data-tip="The maximum run time for the workflow generation. A reasonable value is 60 seconds for workflow tasks of average complexity.">
                  <label className="w-80 text-lg">Timeout (seconds)</label>
                <input
                  type="number"
                  className="input input-bordered w-full max-w-xs"
                  value={workflowConfig.timeout.toString()}
                  onChange={(event) => (workflowConfig.timeout = parseInt(event.target.value))}
                />
              </div>
                    <div className="flex items-center m-2 tooltip tooltip-bottom"
                      data-tip="Specify desired number of workflows that satisfy the specification.">
                  <label className="w-80 text-lg">Number of solutions (max)</label>
                <input
                  type="number"
                  className="input input-bordered w-full max-w-xs"
                  value={workflowConfig.solutionCount.toString()}
                  onChange={(event) => (workflowConfig.solutionCount = parseInt(event.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Prev/next buttons */}
          <div className="flex justify-between p-10">
          <div className="tooltip tooltip-right" data-tip="Go to the previous step.">
              <Link to="/explore/constraints"><button className="btn btn-primary">Previous</button></Link>
              </div>
              <div className="tooltip tooltip-left" data-tip="Run the workflow generation.">
              <button className="btn btn-primary" onClick={() => runSynthesis()}>Run</button>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
});

export { GenerationConfig };
