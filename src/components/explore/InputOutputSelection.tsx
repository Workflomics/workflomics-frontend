import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { DataTax } from '../../stores/DataTaxStore';
import { TreeSelectionBox } from '../TreeSelectionBox';

const InputsOutputSelection: React.FC<any> = observer(({value}) => {
  let { dataTaxStore } = useStore();
  const dataTaxs: DataTax[] = dataTaxStore.availableDataTax;

  React.useEffect(() => {
    dataTaxStore.fetchData();
  }, [dataTaxStore]);

  return (
    <div>
      {dataTaxs.length > 0 && <TreeSelectionBox nodes={dataTaxStore.availableDataTax[0].subsets} value={value[0]} />}
      {dataTaxs.length > 0 && <TreeSelectionBox nodes={dataTaxStore.availableDataTax[1].subsets} value={value[1]} />}
    </div>
  );
});

export { InputsOutputSelection };
