import { makeAutoObservable, runInAction } from "mobx";

/**
 * A constraint as it is stored in the backend.
 */
export interface ConstraintTemplate {
  id: string
  label: string
  parameters: { [key: string]: string }[]
};


export class ConstraintStore {

  availableConstraints: ConstraintTemplate[] = [];
  isLoading: boolean = false;
  error: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  async fetchData(config_path: string) {
    this.isLoading = true;
    this.error = "";
    //TODO: figure out how to get the config.json from github
    // const rewrittenConfigPath = config_path.replace("https://github.com/", "https://raw.githubusercontent.com/")
    //     .replace("/tree/", "/") + "/config.json";
    // "https://github.com/sanctuuary/APE_UseCases/tree/master/MassSpectometry"
    // "https://raw.githubusercontent.com/Workflomics/domain-annotations/main/MassSpectometry/config.json"

    const response = await fetch(`/ape/constraints?config_path=${config_path}`);
    const result = await response.json();
    runInAction(() => {
      this.isLoading = false;
      if (result.error !== undefined) {
        this.error = result.error;
      }
      else {
        this.availableConstraints = result;
      }
    });
  }

}

const constraintStore = new ConstraintStore();
export default constraintStore;
