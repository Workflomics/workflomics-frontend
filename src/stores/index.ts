import domainStore, { DomainStore } from './DomainStore';

export type RootStore = {
  domainStore: DomainStore;
}

const rootStore: RootStore = {
  domainStore,
};

export default rootStore;
