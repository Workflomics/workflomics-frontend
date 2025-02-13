import { makeAutoObservable, runInAction } from "mobx";
import { ApeTaxTuple } from "./TaxStore";


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
  parameters: { [key: string]: string }[]
};


export class ConstraintStore {

  /** Domain constraints are fixed and always added to the config for a synthesis */
  domainConstraints: ConstraintInstance[] = [];

  /** Templates for constraints that can be added by the user */
  availableConstraintTemplates: ConstraintTemplate[] = [];

  /** Status variables */
  isLoading: boolean = false;
  error: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  async fetchDomainConstraints(config_path: string) {
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
        this.domainConstraints = result;
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

  // /**
  //  * Fetches constraints from a given URL and returns them as an array of ConstraintInstance objects.
  //  * @param constraintsUrl The URL of the constraints JSON file.
  //  * @returns An array of ConstraintInstance objects or undefined in case of an error.
  //  */
  // async fetchConstraints(
  //   constraintsUrl: string | undefined
  // ): Promise<ConstraintInstance[] | undefined> {
  //   if (!constraintsUrl) {
  //     console.error("Constraints URL is undefined.");
  //     return undefined;
  //   }
  //   try {
  //     const response = await fetch(constraintsUrl); // Await the response
  //     if (!response.ok) {
  //       throw new Error(
  //         `Failed to fetch constraints: ${response.status} ${response.statusText}`
  //       );
  //     }
  //     const json = await response.json(); // Await the JSON parsing
  //     console.log("Fetched JSON:", json); // Log to inspect the fetched data

  //     return json.constraints.map((constraint: any) => {
  //       return {
  //         id: constraint.constraintid,
  //         label: constraint.constraintid,
  //         parameters: constraint.parameters.map((param: any) => {
  //           return Object.entries(param).reduce((obj, [key, data]) => {
  //             if (Array.isArray(data)) {
  //               if (data.length === 1 && data[0] !== null) {
  //                 // If the data array has a single non-null value, use it
  //                 return { ...obj, [key]: data[0] };
  //               } else {
  //                 // If the array has multiple items or is null, log it
  //                 console.warn(`Unexpected data format for ${key}:`, data);
  //                 return { ...obj, [key]: null }; // You can handle this case differently if needed
  //               }
  //             }
  //             return { ...obj, [key]: data }; // In case data is not an array
  //           }, {});
  //         }),
  //       };
  //     });
  //   } catch (error) {
  //     console.error("Error fetching constraints:", error);
  //     return undefined;
  //   }
  // }



}

const constraintStore = new ConstraintStore();
export default constraintStore;
