import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';

const WorkflowConstraints: React.FC<any> = observer((props) => {

  return (
    <div>

      <ExplorationProgress index={2} />

    </div>
  );
});

export { WorkflowConstraints };
