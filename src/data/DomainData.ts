import { makeAutoObservable, runInAction } from "mobx";
import { InputOutputTypes } from "./WorkflowData";

export interface Domain {
  id: string;
  label: string;
  description: string;
  topics: string[];
  //verified?
  inputOutputTypes: InputOutputTypes[]; // these types are domain-specific?
}

export default class DomainData {

  availableDomains: Domain[] = [];
  selectedDomain: Domain | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  loadData() {
    //TODO: load domain data from database

    // Load dummy data
    this.availableDomains.push({
      id: "proteomics",
      label: "Proteomics",
      description: "bla bla",
      topics: ["OFFICIAL", "BIOINFORMATICS", "PROTEOMICS"],
      inputOutputTypes: []
    });
    this.availableDomains.push({
      id: "metabolomics",
      label: "Metabolomics",
      description: "bla bla",
      topics: ["OFFICIAL", "BIOINFORMATICS", "METABOLOMICS"],
      inputOutputTypes: []
    });
  }

}
