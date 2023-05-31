import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { Link } from 'react-router-dom';

const WorkflowConstraints: React.FC<any> = observer((props) => {

  return (
    <div>

      <ExplorationProgress index={2} />

      <div className="m-8">
        <div className="overflow-x-auto text-left space-y-6 mt-10">

          {/* Constraints */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32">Constraints</span>
            <div className="flex flex-grow items-center">
            </div>
          </div>

          {/* Prev/next buttons */}
          <div className="flex justify-between p-10">
            <Link to="/explore/inputs-outputs"><button className="btn btn-primary">Previous</button></Link>
            <Link to="/explore/configuration"><button className="btn btn-primary">Next</button></Link>
          </div>

        </div>
      </div>
    </div>
  );
});

export { WorkflowConstraints };
