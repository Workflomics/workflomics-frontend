import domainStore, { DomainStore } from './DomainStore';
import exploreDataStore, { ExploreDataStore } from './ExploreDataStore';
import constraintStore, { ConstraintStore } from './ConstraintStore';
import taxStore, { TaxStore } from './TaxStore';

export type RootStore = {
  domainStore: DomainStore;
  taxStore: TaxStore;
  constraintStore: ConstraintStore;
  exploreDataStore: ExploreDataStore;

}

const rootStore: RootStore = {
  domainStore,
  taxStore,
  constraintStore,
  exploreDataStore
};

export default rootStore;
