import domainStore, { DomainStore } from './DomainStore';
import dataTaxStore, { DataTaxStore } from './DataTaxStore';

export type RootStore = {
  domainStore: DomainStore;
  dataTaxStore: DataTaxStore;
}

const rootStore: RootStore = {
  domainStore,
  dataTaxStore
};

export default rootStore;
