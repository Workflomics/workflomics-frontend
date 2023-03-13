import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';

const InputsOutputs: React.FC<any> = observer((props) => {

  return (
    <div>
      <ExplorationProgress index={1} />
      <div className="m-8">
        <div className="overflow-x-auto">
          <span>HI</span>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Topics</th>
                <th>Verified</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export { InputsOutputs };
