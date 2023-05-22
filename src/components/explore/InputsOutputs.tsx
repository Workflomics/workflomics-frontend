import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { useStore } from '../../store';
import { DataTax } from '../../stores/DataTaxStore';
import { TreeSelectionBox } from '../TreeSelectionBox';

const InputsOutputs: React.FC<any> = observer((props) => {
  let { dataTaxStore } = useStore();
  const dataTaxs: DataTax[] = dataTaxStore.availableDataTax;

  React.useEffect(() => {
    dataTaxStore.fetchData();
  }, [dataTaxStore]);

  return (
    <div>

      <ExplorationProgress index={1} />


      <div className="m-8">
        <div className="overflow-x-auto text-left">

          {dataTaxs.length > 0 && <TreeSelectionBox nodes={dataTaxStore.availableDataTax[0].subsets} />}

        </div>
      </div>
    </div>
  );
});

export { InputsOutputs };
