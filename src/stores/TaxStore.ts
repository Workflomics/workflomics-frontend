import { makeAutoObservable, runInAction } from "mobx";

/**
 * The class represents a taxonomy class, that either represents an operation or a data dimension. 
 * A class can have a list of subsets, which are also taxonomy classes. Which forms the taxonomy.
 */
export interface TaxonomyClass {
  id: string;
  label: string;
  root: string;
  subsets?: Array<TaxonomyClass>;
}

/**
 * The type represents a data/operation touple used in APE configuration. It represents either an operation, or a data instance class (obtained from a taxonomy).
 * In each case it comprises of a map of dimensions to taxonomy classes used to depict the given dimension. 
 * 
 * Note: In case of the operation there is only one dimension of data. 
 */
export type ApeTaxTuple = Map<string, TaxonomyClass>;

/**
 * The class represents a store for the taxonomy data. It is used to store the data on operation and data taxonomies,
 * used as vocabularies in the APE configuration.
 */
export class TaxStore {

  /** Tool root mapped to its taxonomy. */
  availableToolTax: ApeTaxTuple = new Map<string, TaxonomyClass>();
  /** Data roots mapped to their respective taxonomies. */
  availableDataTax: ApeTaxTuple = new Map<string, TaxonomyClass>();
  /** List of data dimensions. */
  dataDimensions: Array<string> = [];
  isLoading: boolean = false;
  error: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Fetches data on operation and data taxonomies from the server.
   * @param config_path The path to the APE configuration file.
   */
  async fetchData(config_path: string) {

    this.fetchDataDimensions(config_path);
    this.fetchTools(config_path);
  }

  async fetchTools(config_path: string) {
    this.isLoading = true;
    this.error = "";

    const responseOperations = await fetch(`/ape/get_tools?config_path=${config_path}`);
    const resultOperations = await responseOperations.json();
    runInAction(() => {
      this.isLoading = false;
      if (resultOperations.error !== undefined) {
        this.error = resultOperations.error;
      }
      else {
        const taxMap: ApeTaxTuple = new Map();
        taxMap.set(resultOperations.id, resultOperations);
        this.availableToolTax = taxMap;
      }
    });
  }

  async fetchDataDimensions(config_path: string) {

    const responseData = await fetch(`/ape/get_data?config_path=${config_path}`);
    const resultData = await responseData.json();
    runInAction(() => {
      this.isLoading = false;
      if (resultData.error !== undefined) {
        this.error = resultData.error;
      }
      else {
        const taxMap: ApeTaxTuple = new Map();
        for (let dataTax of resultData) {
          taxMap.set(dataTax.id, dataTax);
          this.dataDimensions.push(dataTax.id);
        }

        this.availableDataTax = taxMap;
      }
    });

  }

  getEmptyTaxParameter(): ApeTaxTuple {
    const emptyTaxParameter: ApeTaxTuple = new Map<string, TaxonomyClass>();
    for (let dimension of this.dataDimensions) {
      emptyTaxParameter.set(dimension, { id: "", label: "", root: dimension });
    }

    return emptyTaxParameter;
  }

  getDimensions(): Array<string> {
    return this.dataDimensions;
  }

}

const taxStore = new TaxStore();
export default taxStore;
