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
            <span className="text-3xl flex-grow-0 w-32">Configuration</span>
            <div className="flex flex-grow items-center">
            </div>
          </div>

          {/* Prev/next buttons */}
          <div className="flex justify-between p-10">
            <Link to="/explore/constraints"><button className="btn btn-primary">Previous</button></Link>
            <button className="btn btn-primary" onClick={() => runSynthesis()}>Run</button>
          </div>

        </div>
      </div>
    </div>
  );
});

export { GenerationConfig };
