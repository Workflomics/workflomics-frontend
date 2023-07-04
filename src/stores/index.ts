import domainStore, { DomainStore } from './DomainStore';
import dataTaxStore, { DataTaxStore } from './DataTaxStore';
import exploreDataStore, { ExploreDataStore } from './ExploreDataStore';
import constraintStore, { ConstraintStore } from './ConstraintStore';
import toolTaxStore, { ToolTaxStore } from './ToolTaxStore';

export type RootStore = {
  domainStore: DomainStore;
  dataTaxStore: DataTaxStore;
  exploreDataStore: ExploreDataStore;
  constraintStore: ConstraintStore;
  toolTaxStore: ToolTaxStore;
}

const rootStore: RootStore = {
  domainStore,
  dataTaxStore,
  exploreDataStore,
  constraintStore,
  toolTaxStore
};

export default rootStore;
