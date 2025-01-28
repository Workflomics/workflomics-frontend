import { makeAutoObservable } from "mobx";
import {
  ConstraintInstance,
  WorkflowConfig,
  WorkflowSolution,
  isTaxParameterComplete,
} from "./WorkflowTypes";
import { makePersistable } from "mobx-persist-store";
import { ApeTaxTuple } from "./TaxStore";

/**
 * TODO: Default inputs should be read from the domain configuration file. 
 */
const emptyWorkflowConfig = () => {
  return {
    domain: undefined,
    inputs: [
      {
        "http://edamontology.org/data_0006": {
          id: "http://edamontology.org/data_0943",
          label: "Mass spectrum",
          root: "http://edamontology.org/data_0006",
          subsets: [],
        },
        "http://edamontology.org/format_1915": {
          id: "http://edamontology.org/format_3244",
          label: "mzML",
          root: "http://edamontology.org/format_1915",
          subsets: [],
        },
      },
      {
        "http://edamontology.org/data_0006": {
          id: "http://edamontology.org/data_2976",
          label: "Protein sequence",
          root: "http://edamontology.org/data_0006",
          subsets: [],
        },
        "http://edamontology.org/format_1915": {
          id: "http://edamontology.org/format_1929",
          label: "FASTA",
          root: "http://edamontology.org/format_1915",
          subsets: [],
        },
      },
    ],
    outputs: [
      {
        "http://edamontology.org/data_0006": {
          id: "http://edamontology.org/data_3753",
          label: "Over-representation data",
          root: "http://edamontology.org/data_0006",
          subsets: [],
        },
        "http://edamontology.org/format_1915": {
          id: "http://edamontology.org/format_3464",
          label: "JSON",
          root: "http://edamontology.org/format_1915",
          subsets: [],
        },
      },
    ],
    constraints: [{ id: "", label: "", parameters: [] } as ConstraintInstance],
    minSteps: 3,
    maxSteps: 4,
    timeout: 120,
    solutionCount: 10,
    run_id: "",
  };
};

interface DomainConfig {
  ontology_path: string;
  ontologyPrefixIRI: string;
  tool_annotations_path: string;
  strict_tool_annotations: string;
  use_workflow_input: string;
  use_all_generated_data: string;
  tool_seq_repeat: string;
  constraints_path: string;
}

export class ExploreDataStore {
  workflowConfig: WorkflowConfig = emptyWorkflowConfig();
  workflowSolutions: WorkflowSolution[] = [];
  selectedWorkflowSolutions: WorkflowSolution[] = [];
  isGenerating: boolean = false;
  generationError: string = "";

  constructor() {
    makeAutoObservable(this, {}, { deep: true });
    makePersistable(this, {
      name: "ExploreDataStore",
      properties: ["workflowConfig", "workflowSolutions"],
      storage: window.localStorage,
    });
  }

  /**
   * Returns a JSON representation of a list of inputs or outputs that can be used in a workflow config.
   * @param inputsOutputs list of inputs or outputs
   * @returns JSON representation of the inputs or outputs
   */
  inputsOutputsToJSON(inputsOutputs: ApeTaxTuple[]) {
    return inputsOutputs
      .filter((parameter) => isTaxParameterComplete(parameter))
      .map(this.parameterToJSON);
  }

  /**
   * Returns a JSON representation of a TaxParameter that can be used in a workflow config.
   * @param param taxonomy parameter
   * @returns JSON representation of the parameter
   */
  parameterToJSON(param: ApeTaxTuple) {
    return Object.entries(param).reduce((obj, [key, data]) => {
      return { ...obj, [key]: [data.id] };
    }, {});
  }

  /**
   * Reads a domain configuration JSON from a URL and returns it as an object.
   * @param url The URL of the domain configuration JSON file.
   * @returns The domain configuration object or undefined in case of an error.
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
  async fetchConstraints(constraintsUrl: string | undefined): Promise<ConstraintInstance[] | undefined> {
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
      console.log('Fetched JSON:', json); // Log to inspect the fetched data
  
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

  /**
   * Returns a JSON representation of a list of constraints that can be used in a workflow config.
   * @param allConstraints list of constraints
   * @returns JSON representation of the constraints
   */
  constraintsToJSON(allConstraints: ConstraintInstance[]) {
    const newConst = allConstraints
      .filter((constraint) => constraint.id !== "")
      .map((constraint) => {
        return {
          constraintid: constraint!.id,
          parameters: constraint!.parameters.map(
            this.parameterToJSON
            //TODO: how to pass the parameters?
            // param => Object.entries(param).reduce(
            //   (obj, [key, data]) => { return { ...obj, [key]: data.id} }, {}
            // )
          ),
          // "parameters": value!.parameters.map(this.parameterToJSON)
        };
      });
    newConst.push({
      constraintid: "not_connected_op",
      parameters: [
        {
          operation_0004: ["PeptideProphet"],
        },
        {
          operation_0004: ["PeptideProphet"],
        },
      ],
    });
    newConst.push({
      constraintid: "not_connected_op",
      parameters: [
        {
          operation_0004: ["operation_0335"],
        },
        {
          operation_0004: ["operation_0335"],
        },
      ],
    });
    newConst.push({
      constraintid: "connected_op",
      parameters: [
        {
          operation_0004: ["PeptideProphet"],
        },
        {
          operation_0004: ["ProteinProphet"],
        },
      ],
    });
    return newConst;
  }

  async configToJSON(config: WorkflowConfig): Promise<any> {
    // These should be dynamically generated from the domain configuration file
    const dataRoot: string = "http://edamontology.org/data_0006";
    const formatRoot: string = "http://edamontology.org/format_1915";
    const toolsRoot: string = "operation_0004";

    const default_domain_config = await this.readDomainConfig(
      config.domain?.repo_url
    );

    const run_constraints: ConstraintInstance [] = []
      // The execution is not working with the constraints pulled from the domain config
      // (await this.fetchConstraints(default_domain_config?.constraints_path)) || [];
    config.constraints?.forEach((constraint) => {
      if (constraint.id !== "") {
        run_constraints?.push(constraint);
      }
    });

    const obj: any = {
      ontology_path: default_domain_config?.ontology_path,
      ontologyPrefixIRI: default_domain_config?.ontologyPrefixIRI,
      toolsTaxonomyRoot: toolsRoot,
      dataDimensionsTaxonomyRoots: [dataRoot, formatRoot],
      tool_annotations_path: default_domain_config?.tool_annotations_path,
      strict_tool_annotations: default_domain_config?.strict_tool_annotations,
      timeout_sec: config.timeout,
      solution_length: {
        min: config.minSteps,
        max: config.maxSteps,
      },
      solutions: config.solutionCount,
      number_of_execution_scripts: config.solutionCount,
      number_of_generated_graphs: config.solutionCount,
      debug_mode: "false",
      use_workflow_input: default_domain_config?.use_workflow_input || "all",
      use_all_generated_data:
        default_domain_config?.use_all_generated_data || "one",
      tool_seq_repeat: default_domain_config?.tool_seq_repeat || "false",
      inputs: this.inputsOutputsToJSON(config.inputs),
      outputs: this.inputsOutputsToJSON(config.outputs),
      constraints: this.constraintsToJSON(run_constraints),
    };
    return obj;
  }

  async runSynthesis(config: WorkflowConfig) {
    const configJson: any = await this.configToJSON(config);

    this.isGenerating = true;
    this.workflowSolutions = [];
    fetch(`/ape/run_synthesis_and_bench`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(configJson),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Request failed: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        this.workflowSolutions = data;
        this.workflowSolutions.forEach((solution) => {
          solution.isSelected = true;
          this.loadImage(solution);
          this.loadBenchmarkData(solution);
        });
        this.isGenerating = false;
      })
      .catch((error) => {
        console.log("Error:", error);
        this.generationError = error;
        this.isGenerating = false;
      });
  }

  loadImage(solution: WorkflowSolution) {
    const { run_id, figure_name } = solution;
    const request = {
      run_id: run_id,
      format: "svg",
      file_name: figure_name,
    };
    fetch("/ape/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        solution.image = url;
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error, display fallback image, or show error message
      });
  }

  loadBenchmarkData(solution: WorkflowSolution) {
    const { run_id, benchmark_file } = solution;
    fetch(
      `/ape/design_time_benchmarks?run_id=${run_id}&file_name=${benchmark_file}`
    )
      .then((response) => response.json())
      .then((data) => {
        solution.benchmarkData = data;
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error, display fallback image, or show error message
      });
  }
}

const exploreDataStore = new ExploreDataStore();
export default exploreDataStore;
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
