import { makeAutoObservable, runInAction } from "mobx";

export interface Domain {
  id: string;
  unique_label: string;
  description: string;
  repo_url: string;
  public: boolean;
  topic_of_research: TopicOfResearch[];
  executable: boolean;
}

export interface TopicOfResearch {
  id: string;
  unique_label: string;
}

export class DomainStore {

  availableDomains: Domain[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchData() {
    const response = await fetch('/api/domain?select=*,topic_of_research(id,unique_label)');
    const domains = await response.json();
    runInAction(() => {
      this.availableDomains = domains;
    });
  }

}

const domainStore = new DomainStore();
export default domainStore;
