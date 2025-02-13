import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { UserConfig, WorkflowSolution, isTaxParameterComplete } from "./WorkflowTypes";
import { ApeTaxTuple } from "./TaxStore";
import { ConstraintInstance } from "./ConstraintStore";
import domainStore, { DomainConfig, JsonConstraintInstance } from "./DomainStore";

/**
 * TODO: Default inputs should be read from the domain configuration file.
 */
const emptyWorkflowConfig = () => {
  return {
    domain: undefined,
    domainConfig: undefined,
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



/** Store for exploration configuration and solutions  */
export class ExploreDataStore {
  userConfig: UserConfig = emptyWorkflowConfig();

  workflowSolutions: WorkflowSolution[] = [];
  selectedWorkflowSolutions: WorkflowSolution[] = [];
  isGenerating: boolean = false;
  generationError: string = "";

  constructor() {
    makeAutoObservable(this, {}, { deep: true });
    makePersistable(this, {
      name: "ExploreDataStore",
      properties: ["userConfig", "workflowSolutions"],
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
   * Returns a JSON representation of a list of constraints that can be used in a workflow config.
   * @param allConstraints list of constraints
   * @returns JSON representation of the constraints
   */
  constraintsToJSON(allConstraints: ConstraintInstance[]): JsonConstraintInstance[] {
    const newConst = allConstraints
      .filter((constraint) => constraint.id !== "")
      .map((constraint) => {
        return {
          constraintid: constraint!.id,
          parameters: constraint!.parameters.map(this.parameterToJSON),
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

  /** Combines the default domain config with the selected options in the GUI
   *  (inputs, outputs, constraints, generation parameters) to create a configuration
   *  to use for synthesis.
   */
  constructSynthesisConfig(config: UserConfig): DomainConfig {
    const defaultConfig = domainStore.currentDomainConfig;
    if (!defaultConfig) {
      throw new Error("No domain configuration found");
    }

    const run_constraints: ConstraintInstance[] = [];
    // The execution is not working with the constraints pulled from the domain config
    // (await this.fetchConstraints(default_domain_config?.constraints_path)) || [];
    config.constraints?.forEach((constraint) => {
      if (constraint.id !== "") {
        run_constraints?.push(constraint);
      }
    });

    const obj: DomainConfig = {
      ontology_path:  defaultConfig.ontology_path,
      ontologyPrefixIRI: defaultConfig.ontologyPrefixIRI,
      toolsTaxonomyRoot: defaultConfig.toolsTaxonomyRoot,
      dataDimensionsTaxonomyRoots: defaultConfig.dataDimensionsTaxonomyRoots,
      tool_annotations_path: defaultConfig.tool_annotations_path,
      constraints_path: defaultConfig.constraints_path,
      strict_tool_annotations: defaultConfig.strict_tool_annotations,
      timeout_sec: config.timeout.toString(),
      solutions_dir_path: defaultConfig.solutions_dir_path || ".",
      solution_length: {
        min: config.minSteps,
        max: config.maxSteps,
      },
      solutions: config.solutionCount.toString(),
      number_of_execution_scripts: config.solutionCount.toString(),
      number_of_generated_graphs: config.solutionCount.toString(),
      number_of_cwl_files: config.solutionCount.toString(),
      debug_mode: "false",
      use_workflow_input: defaultConfig?.use_workflow_input || "all",
      use_all_generated_data:
        defaultConfig?.use_all_generated_data || "one",
      tool_seq_repeat: defaultConfig?.tool_seq_repeat || "false",
      inputs: this.inputsOutputsToJSON(config.inputs),
      outputs: this.inputsOutputsToJSON(config.outputs),
      constraints: this.constraintsToJSON(run_constraints),
    };
    return obj;
  }

  runSynthesis(config: UserConfig) {
    const synthesisConfig: DomainConfig = this.constructSynthesisConfig(config);

    this.isGenerating = true;
    this.workflowSolutions = [];
    fetch(`/ape/run_synthesis_and_bench`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(synthesisConfig),
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
