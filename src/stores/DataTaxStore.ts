import { makeAutoObservable } from "mobx";

export interface DataTax {
  id: string;
  label: string;
  subsets: Array<DataTax>;
}

export class DataTaxStore {

  availableDataTax: DataTax[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchData() {
    //TODO: get path from user selection
    const config_path: string = "https://raw.githubusercontent.com/Workflomics/domain-annotations/main/MassSpectometry/config.json"
    const response = await fetch(`/ape/get_data?config_path=${config_path}`);
    this.availableDataTax = await response.json();
    console.log(this.availableDataTax);
  }

}

const dataTaxStore = new DataTaxStore();
export default dataTaxStore;
