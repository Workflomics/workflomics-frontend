import { makeAutoObservable, runInAction } from "mobx";

/**
 * The class represents a taxonomy class, that either represents an operation or a data dimension. 
 * A class can have a list of subsets, which are also taxonomy classes. Which forms the taxonomy.
 */
export interface TaxonomyClass {
  id: string;
  label: string;
  root: string;
  subsets: Array<TaxonomyClass> | [];
}

/**
 * The type represents a data/operation tuple used in APE configuration. 
 * It represents either an operation, or a data instance class (obtained from a taxonomy).
 * In each case it comprises of a map of dimensions to taxonomy classes used to depict the given dimension. 
 * 
 * Note: In case of the operation there is only one dimension of data. 
 */
export type ApeTaxTuple = Record<string, TaxonomyClass>;

/**
 * The class represents a store for the taxonomy data. It is used to store the data on operation and data taxonomies,
 * used as vocabularies in the APE configuration.
 */
export class TaxStore {

  /** Tool root mapped to its taxonomy. */
  availableToolTax: ApeTaxTuple = {};
  /** Data roots mapped to their respective taxonomies. */
  availableDataTax: ApeTaxTuple = {};
  /** List of data dimensions. */
  isLoading: boolean = false;
  error: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Fetches available taxonomies for tools from the server.
   * @param config_path The path to the domain configuration file to be used by APE.
   */
  async fetchTools(config_path: string) {
    this.isLoading = true;
    this.error = "";

    const responseOperations = await fetch(`/ape/tools_taxonomy?config_path=${config_path}`);
    const resultOperations = await responseOperations.json();
    runInAction(() => {
      this.isLoading = false;
      if (resultOperations.error !== undefined) {
        this.error = resultOperations.error;
      }
      else {
        const taxMap: ApeTaxTuple = {
          [resultOperations.id]: resultOperations
        };
        this.availableToolTax = taxMap;
      }
    });
  }

  /**
   * Fetches available taxonomies for data from the server.
   * @param config_path The path to the domain configuration file to be used by APE.
   */
  async fetchDataDimensions(config_path: string) {
    this.isLoading = true;
    this.error = "";

    const responseData = await fetch(`/ape/data_taxonomy?config_path=${config_path}`);
    const resultData = await responseData.json();
    runInAction(() => {
      this.isLoading = false;
      if (resultData.error !== undefined) {
        this.error = resultData.error;
      }
      else {
        const taxMap: ApeTaxTuple = {};
        for (let dataTax of resultData) {
          taxMap[dataTax.id] = this.cleanTaxonomyClass(dataTax);
        }
        this.availableDataTax = taxMap;
      }
    });
  }

  getEmptyTaxParameter(root: ApeTaxTuple): ApeTaxTuple {
    const emptyTaxParameter: ApeTaxTuple = {};
    for (let taxRoot of Object.values(root)) {
      emptyTaxParameter[taxRoot.id] = { id: taxRoot.id, label: taxRoot.label, root: taxRoot.root, subsets: [] };
    }
    return emptyTaxParameter;
  }

  copyTaxonomyClass(taxonomyClass: TaxonomyClass): TaxonomyClass {
    return { id: taxonomyClass.id, label: taxonomyClass.label, root: taxonomyClass.root, subsets: [] };
  }

  findDataTaxonomyClass = (id: string, root: string): TaxonomyClass | undefined => {
    const fullID = "http://edamontology.org/" + id;
    const rootTC: TaxonomyClass = this.availableDataTax["http://edamontology.org/" + root];
    console.log(root, rootTC, fullID);
    if (rootTC.id === fullID) {
      return rootTC;
    }
    return this.findDataTaxonomyClassInParent(fullID, rootTC);
  };

  findDataTaxonomyClassInParent = (id: string, parent: TaxonomyClass): TaxonomyClass | undefined => {
    if (!parent.subsets) {
      return undefined;
    }
    for (let tc of parent.subsets) {
      if (tc.id === id) {
        return tc;
      }
      const tc2 = this.findDataTaxonomyClassInParent(id, tc);
      if (tc2 !== undefined) {
        return tc2;
      }
    }
    return undefined;
  };

  /**
   * Removes entries from the taxonomy class which are invalid for the UI.
   * Currently, those are plain taxonomy entries, i.e. the ones with label ending with "_p".
   *
   * @param current The current taxonomy class in the recursive cleaning.
   */
  cleanTaxonomyClass = (current: TaxonomyClass): TaxonomyClass => {

    const currentOut = this.copyTaxonomyClass(current);
    let subTaxs: Array<TaxonomyClass> = [];

    if (current.subsets){
      /* Copy all elements of the subtree which have a specific property. */
      for (let tc of current.subsets) {

        /* Copy non-plain taxonomy classes. */
        if (! tc.id.endsWith("_plain") ) {
          subTaxs.push(this.cleanTaxonomyClass(tc));
        }

      }
    }

    currentOut.subsets = subTaxs;
    return currentOut;
  }

}

const taxStore = new TaxStore();
export default taxStore;
