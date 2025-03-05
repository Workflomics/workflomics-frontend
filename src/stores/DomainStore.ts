import { makeAutoObservable, runInAction } from "mobx";
import exploreDataStore from "./ExploreDataStore";
import constraintStore from "./ConstraintStore";

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

/** A constraint instance as it is represented for APE */
export interface JsonConstraintInstance {
  constraintid: string;
  parameters: Record<string, string[]>[];
}

/** A domain configuration object that contains the configuration of the domain.
 *  It contains the inputs/outputs/constraints/tools that apply to this domain and
 *  has some default values for the workflow generation.
 */
export interface DomainConfig {
  ontology_path: string;
  ontologyPrefixIRI: string;
  toolsTaxonomyRoot: string;
  dataDimensionsTaxonomyRoots: string[];
  tool_annotations_path: string;
  constraints_path: string;

  strict_tool_annotations: string;
  timeout_sec: number;
  solutions_dir_path: string;
  solution_length: {
    min: number;
    max: number;
  };
  solutions: number;

  number_of_execution_scripts: number;
  number_of_generated_graphs: number;
  number_of_cwl_files: number;
  debug_mode: string;
  use_workflow_input: string;
  use_all_generated_data: string;
  tool_seq_repeat: string;

  inputs: Record<string, string[]>[];
  outputs: Record<string, string[]>[];
  constraints: JsonConstraintInstance[];
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

  async fetchDomains() {
    const response = await fetch('/api/domain?select=*,topic_of_research(id,unique_label)');
    const domains = await response.json();
    runInAction(() => {
      this.availableDomains = domains;
    });
  }

  async selectDomain(domain: Domain) {
    runInAction(() => {
      // Set the newly selected domain
      exploreDataStore.setDomain(domain);

      // Fetch the domain configuration
      domainStore.fetchDomainConfig(domain.repo_url);

      // Fetch the constraints for the domain
      constraintStore.fetchDomainConstraints(domain.repo_url);
    });
  }

  /**
   * Reads a domain configuration JSON from a URL and returns it as an object.
   * @param url The URL of the domain configuration JSON file.
   * @returns The domain configuration object or null in case of an error.
   */
  
  async fetchDomainConfig(url: string): Promise<void> {
    exploreDataStore.domainConfig = undefined;
    if (!url) {
      console.error("Domain configuration URL is undefined.");
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
        exploreDataStore.domainConfig = json;
      }
      else {
        console.error(
          "Fetched JSON is not a valid APE domain configuration:",
          json
        );
      }
    } catch (error) {
      console.error("Error fetching domain configuration:", error);
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
