import { makeAutoObservable, runInAction } from "mobx";
import { ApeTaxTuple } from "./TaxStore";
import exploreDataStore from "./ExploreDataStore";


/** An instance of a constraint */
export type ConstraintInstance = {
  id: string,
  label: string,
  parameters: ApeTaxTuple[]
}

/** Template for a constraint that can be added by the user */
export interface ConstraintTemplate {
  id: string
  label: string
  parameters: Record<string, string>[]
};


export class ConstraintStore {

  /** Templates for constraints that can be added by the user */
  availableConstraintTemplates: ConstraintTemplate[] = [];

  /** Status variables */
  isLoading: boolean = false;
  error: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  async fetchDomainConstraints(config_path: string) {
    exploreDataStore.domainConstraints = [];
    this.isLoading = true;
    this.error = "";
    const response = await fetch(`/ape/domain_constraints?config_path=${config_path}`);
    const result = await response.json();
    runInAction(() => {
      this.isLoading = false;
      if (result.error !== undefined) {
        this.error = result.error;
      }
      else {
        exploreDataStore.domainConstraints = result;
      }
    });
  }

  async fetchConstraintTemplates(config_path: string) {
    this.isLoading = true;
    this.error = "";
    const response = await fetch(`/ape/constraint_templates?config_path=${config_path}`);
    const result = await response.json();
    runInAction(() => {
      this.isLoading = false;
      if (result.error !== undefined) {
        this.error = result.error;
      }
      else {
        this.availableConstraintTemplates = result;
      }
    });
  }

}

const constraintStore = new ConstraintStore();
export default constraintStore;
