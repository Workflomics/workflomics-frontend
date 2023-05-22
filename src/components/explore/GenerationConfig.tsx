import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';

const GenerationConfig: React.FC<any> = observer((props) => {

  return (
    <div>

      <ExplorationProgress index={3} />

    </div>
  );
});

export { GenerationConfig };
