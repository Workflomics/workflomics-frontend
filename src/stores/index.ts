import domainStore, { DomainStore } from './DomainStore';
import dataTaxStore, { DataTaxStore } from './DataTaxStore';
import exploreDataStore, { ExploreDataStore } from './ExploreDataStore';
import constraintStore, { ConstraintStore } from './ConstraintStore';

export type RootStore = {
  domainStore: DomainStore;
  dataTaxStore: DataTaxStore;
  exploreDataStore: ExploreDataStore;
  constraintStore: ConstraintStore;
}

const rootStore: RootStore = {
  domainStore,
  dataTaxStore,
  exploreDataStore,
  constraintStore
};

export default rootStore;
