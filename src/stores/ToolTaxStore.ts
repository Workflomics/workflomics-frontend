import { makeAutoObservable, runInAction } from "mobx";

export interface ToolTax {
  id: string;
  label: string;
  subsets: Array<ToolTax>;
}

export class ToolTaxStore {

  availableToolTax: Map<string, ToolTax> = new Map();
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

    const response = await fetch(`/ape/get_tools?config_path=${config_path}`);
    const result = await response.json();
    runInAction(() => {
      this.isLoading = false;
      if (result.error !== undefined) {
        this.error = result.error;
      }
      else {
        const taxMap: Map<string, ToolTax> = new Map();
        taxMap.set(result.id, result);
        this.availableToolTax = taxMap;
      }
    });
  }

}

const toolTaxStore = new ToolTaxStore();
export default toolTaxStore;
