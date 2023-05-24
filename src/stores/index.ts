import domainStore, { DomainStore } from './DomainStore';
import dataTaxStore, { DataTaxStore } from './DataTaxStore';
import exploreDataStore, { ExploreDataStore } from './ExploreDataStore';

export type RootStore = {
  domainStore: DomainStore;
  dataTaxStore: DataTaxStore;
  exploreDataStore: ExploreDataStore;
}

const rootStore: RootStore = {
  domainStore,
  dataTaxStore,
  exploreDataStore
};

export default rootStore;
