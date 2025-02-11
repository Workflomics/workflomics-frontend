import { makeAutoObservable, runInAction } from "mobx";
import {
  ConstraintInstance,
} from "./WorkflowTypes";

/** A domain entry that represents a domain for selection in a list.
 *  It contains a link to the domain's configuration file.
 */
export interface Domain {
  id: string;
  unique_label: string;
  description: string;
  repo_url: string;
  public: boolean;
  topic_of_research: TopicOfResearch[];
  executable: boolean;
}

/** A domain configuration object that contains the configuration of the domain.
 *  It contains the inputs/outputs/constraints/tools that apply to this domain and
 *  has some default values for the workflow generation.
 */
export interface DomainConfig {
  ontology_path: string;
  ontologyPrefixIRI: string;
  tool_annotations_path: string;
  strict_tool_annotations: string;
  use_workflow_input: string;
  use_all_generated_data: string;
  tool_seq_repeat: string;
  constraints_path: string;
  timeout_sec: string;
  solution_length: {
    min: number;
    max: number;
  };
  solutions: string;
}

export interface TopicOfResearch {
  id: string;
  unique_label: string;
}

export class DomainStore {

  availableDomains: Domain[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchData() {
    const response = await fetch('/api/domain?select=*,topic_of_research(id,unique_label)');
    const domains = await response.json();
    runInAction(() => {
      this.availableDomains = domains;
    });
  }

  /**
   * Reads a domain configuration JSON from a URL and returns it as an object.
   * @param url The URL of the domain configuration JSON file.
   * @returns The domain configuration object or null in case of an error.
   */
  async readDomainConfig(
    url: string | undefined
  ): Promise<DomainConfig | null> {
    if (!url) {
      console.error("Domain configuration URL is undefined.");
      return null;
    }
    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch domain configuration: ${response.status} ${response.statusText}`
        );
      }
      const json = await response.json();
      if (isDomainConfig(json)) {
        return json;
      } else {
        console.error(
          "Fetched JSON is not a valid APE domain configuration:",
          json
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching domain configuration:", error);
      return null;
    }
  }

  /**
   * Fetches constraints from a given URL and returns them as an array of ConstraintInstance objects.
   * @param constraintsUrl The URL of the constraints JSON file.
   * @returns An array of ConstraintInstance objects or undefined in case of an error.
   */
  async fetchConstraints(
    constraintsUrl: string | undefined
  ): Promise<ConstraintInstance[] | undefined> {
    if (!constraintsUrl) {
      console.error("Constraints URL is undefined.");
      return undefined;
    }
    try {
      const response = await fetch(constraintsUrl); // Await the response
      if (!response.ok) {
        throw new Error(
          `Failed to fetch constraints: ${response.status} ${response.statusText}`
        );
      }
      const json = await response.json(); // Await the JSON parsing
      console.log("Fetched JSON:", json); // Log to inspect the fetched data

      return json.constraints.map((constraint: any) => {
        return {
          id: constraint.constraintid,
          label: constraint.constraintid,
          parameters: constraint.parameters.map((param: any) => {
            return Object.entries(param).reduce((obj, [key, data]) => {
              if (Array.isArray(data)) {
                if (data.length === 1 && data[0] !== null) {
                  // If the data array has a single non-null value, use it
                  return { ...obj, [key]: data[0] };
                } else {
                  // If the array has multiple items or is null, log it
                  console.warn(`Unexpected data format for ${key}:`, data);
                  return { ...obj, [key]: null }; // You can handle this case differently if needed
                }
              }
              return { ...obj, [key]: data }; // In case data is not an array
            }, {});
          }),
        };
      });
    } catch (error) {
      console.error("Error fetching constraints:", error);
      return undefined;
    }
  }

}
const domainStore = new DomainStore();
export default domainStore;

function isDomainConfig(obj: any): obj is DomainConfig {
  return (
    typeof obj === "object" &&
    typeof obj.ontology_path === "string" &&
    typeof obj.ontologyPrefixIRI === "string" &&
    typeof obj.tool_annotations_path === "string" &&
    typeof obj.strict_tool_annotations === "string" &&
    typeof obj.use_workflow_input === "string" &&
    typeof obj.use_all_generated_data === "string" &&
    typeof obj.tool_seq_repeat === "string" &&
    typeof obj.constraints_path === "string"
  );
}
