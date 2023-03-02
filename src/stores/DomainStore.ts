import { makeAutoObservable } from "mobx";

export interface Domain {
  id: string;
  unique_label: string;
  description: string;
  topic_of_research: TopicOfResearch[];
}

export interface TopicOfResearch {
  id: string;
  unique_label: string;
}

export class DomainStore {

  availableDomains: Domain[] = [];
  selectedDomain: Domain | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchData() {
    const response = await fetch('http://localhost:3333/domain?select=id,unique_label,description,topic_of_research(id,unique_label)');
    this.availableDomains = await response.json();
  }

}

const domainStore = new DomainStore();
export default domainStore;
