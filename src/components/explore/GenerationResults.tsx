import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';

const GenerationResults: React.FC<any> = observer((props) => {

  return (
    <div>

      <ExplorationProgress index={4} />

      <div className="m-8">
        <div className="overflow-x-auto text-left space-y-6 mt-10">

          {/* Results */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32">Results</span>
            <div className="flex flex-grow items-center">
            </div>
          </div>
        </div>
      </div>

    </div>
  );
});

export { GenerationResults };
