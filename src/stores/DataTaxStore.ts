import { makeAutoObservable, runInAction } from "mobx";
import { TaxParameter, TaxonomyClass } from "./WorkflowTypes";

export interface DataTax {
  id: string;
  label: string;
  subsets: Array<DataTax>;
}

export class DataTaxStore {

  availableDataTax: Map<string, DataTax> = new Map();
  dataDimensions: Array<string> = [];
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

    const response = await fetch(`/ape/get_data?config_path=${config_path}`);
    const result = await response.json();
    runInAction(() => {
      this.isLoading = false;
      if (result.error !== undefined) {
        this.error = result.error;
      }
      else {
        const taxMap: Map<string, DataTax> = new Map();
        for (let dataTax of result) {
          taxMap.set(dataTax.id, dataTax);
          this.dataDimensions.push(dataTax.id);
        }

        this.availableDataTax = taxMap;
      }
    });
  }

  getDimensions(): Array<string> {
    return this.dataDimensions;
  }


  getEmptyTaxParameter(): TaxParameter {
    const emptyTaxParameter: TaxParameter = new Map<string, TaxonomyClass>();
    for (let dimension of this.dataDimensions) {
      emptyTaxParameter.set(dimension, { id: "", label: "", root: dimension });
    }

    return emptyTaxParameter;
  }
}
const dataTaxStore = new DataTaxStore();
export default dataTaxStore;
