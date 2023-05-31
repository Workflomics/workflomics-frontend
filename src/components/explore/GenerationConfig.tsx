import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { Link } from 'react-router-dom';

const GenerationConfig: React.FC<any> = observer((props) => {

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
            <Link to="/explore/results"><button className="btn btn-primary">Run</button></Link>
          </div>

        </div>
      </div>
    </div>
  );
});

export { GenerationConfig };
