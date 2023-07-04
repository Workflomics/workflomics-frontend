import { makeAutoObservable, runInAction } from "mobx";

export interface Constraint {
  id: string
  label: string
  parameters: { [key: string]: string }[]
};

function renameKey<T extends Record<string, any>>(obj: T, oldKey: string, newKey: keyof T): T {
  if (oldKey === newKey) {
    return obj;
  }
  const { [oldKey]: value, ...rest } = obj;
  return { [newKey]: value, ...rest } as T;
}

function renameKeysInList<T extends Record<string, any>>(list: T[], oldKey: string, newKey: keyof T): T[] {
  return list.map(item => renameKey(item, oldKey, newKey));
}

export class ConstraintStore {

  availableConstraints: Constraint[] = [];
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
    
    const response = await fetch(`/ape/get_constraints?config_path=${config_path}`);
    const result = await response.json();
    runInAction(() => {
      this.isLoading = false;
      if (result.error !== undefined) {
        this.error = result.error;
      }
      else {
        let mappedResult = renameKeysInList<Constraint>(result, "constraintID", "id");
        mappedResult = renameKeysInList<Constraint>(mappedResult, "description", "label");
        this.availableConstraints = mappedResult;
      }
    });
  }

}

const constraintStore = new ConstraintStore();
export default constraintStore;
