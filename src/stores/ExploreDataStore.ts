import { makeAutoObservable } from "mobx";
import { ConstraintInstance, WorkflowConfig, WorkflowSolution, isTaxParameterComplete as isTaxParameterComplete } from "./WorkflowTypes";
import { makePersistable } from "mobx-persist-store";
import DomainStore from "./DomainStore";
import { ApeTaxTuple } from "./TaxStore";

const emptyWorkflowConfig = () => {
  return {
    domain: undefined,
    inputs: [
      new Map([
        ["http://edamontology.org/data_0006", { id: "http://edamontology.org/data_0943", label: "Mass spectrum", root: "http://edamontology.org/data_0006" }],
        ["http://edamontology.org/format_1915", { id: "http://edamontology.org/format_3244", label: "mzML", root: "http://edamontology.org/format_1915" }],
      ]),
      new Map([
        ["http://edamontology.org/data_0006", { id: "http://edamontology.org/data_2976", label: "Protein sequence", root: "http://edamontology.org/data_0006" }],
        ["http://edamontology.org/format_1915", { id: "http://edamontology.org/format_1929", label: "FASTA", root: "http://edamontology.org/format_1915" }],
      ]),
    ],
    outputs: [
      new Map([
        ["http://edamontology.org/data_0006", { id: "http://edamontology.org/data_0006", label: "Data", root: "http://edamontology.org/data_0006" }],
        ["http://edamontology.org/format_3747", { id: "http://edamontology.org/format_3747", label: "protXML", root: "http://edamontology.org/format_1915" }],
      ]),
    ],
    constraints: [{ id: "", label: "", parameters: [] } as ConstraintInstance],
    minSteps: 3,
    maxSteps: 4,
    timeout: 120,
    solutionCount: 10,
    run_id: ""
  }
}

export class ExploreDataStore {

  workflowConfig: WorkflowConfig = emptyWorkflowConfig();
  workflowSolutions: WorkflowSolution[] = [];
  isGenerating: boolean = false;
  generationError: string = "";

  constructor() {
    makeAutoObservable(this, {}, { deep: true });
    makePersistable(this, {
      name: "ExploreDataStore",
      properties: ["workflowConfig", "workflowSolutions"],
      storage: window.localStorage
    });
  }

  /**
   * Returns a JSON representation of a list of inputs or outputs that can be used in a workflow config.
   * @param inputsOutputs list of inputs or outputs
   * @returns JSON representation of the inputs or outputs
   */
  inputsOutputsToJSON(inputsOutputs: ApeTaxTuple[]) {
    return inputsOutputs.filter(parameter => isTaxParameterComplete(parameter))
      .map((parameter) => this.parameterToJSON(parameter));
  }

  /**
   * Returns a JSON representation of a TaxParameter that can be used in a workflow config.
   * @param param taxonomy parameter
   * @returns JSON representation of the parameter
   */
  parameterToJSON(param: ApeTaxTuple) {
    const objectArray: any[] = [];
    Array.from(param.entries()).forEach(([key, data]) => (
      objectArray.push({ [key]: [data!.id] })));
    return objectArray;
  }

  /**
   * Returns a JSON representation of a list of constraints that can be used in a workflow config.
   * @param constraints list of constraints
   * @returns JSON representation of the constraints
   */
  constraintsToJSON(constraints: ConstraintInstance[]) {
    return constraints
      .map((value) => {
        return {
          ["id"]: value!.id,
          ["parameters"]: value!.parameters.map((parameter) => this.parameterToJSON(parameter)
          )
        };
      });
  }

  configToJSON(config: WorkflowConfig): any {
    // These should be dynamically generated from the domain configuration file
    const dataRoot: string = "http://edamontology.org/data_0006";
    const formatRoot: string = "http://edamontology.org/format_1915";
    const toolsRoot: string = "operation_0004";

    const inputs = this.inputsOutputsToJSON(config.inputs);
    const outputs = this.inputsOutputsToJSON(config.outputs);
    const constraints = this.constraintsToJSON(config.constraints);

    //TODO: figure out how much of this to hardcode
    const obj: any = {
      "ontology_path": "https://raw.githubusercontent.com/Workflomics/domain-annotations/main/edam.owl",
      "ontologyPrefixIRI": "http://edamontology.org/",
      "toolsTaxonomyRoot": toolsRoot,
      "dataDimensionsTaxonomyRoots": [
        dataRoot, formatRoot
      ],
      "tool_annotations_path": "https://raw.githubusercontent.com/Workflomics/domain-annotations/main/WombatP_tools/bio.tools.json",
      "strict_tool_annotations": "true",
      "timeout_sec": config.timeout,
      "solution_length": {
        "min": config.minSteps,
        "max": config.maxSteps
      },
      "solutions": config.solutionCount,
      "number_of_execution_scripts": config.solutionCount,
      "number_of_generated_graphs": config.solutionCount,
      "debug_mode": "false",
      "use_workflow_input": "all",
      "use_all_generated_data": "all",
      "tool_seq_repeat": "false",
      "inputs": inputs,
      "outputs": outputs,
      "constraints": constraints
    };
    return obj;
  }

  runSynthesis(config: WorkflowConfig) {
    const domainConfig = config.domain;
    const configJson: any = this.configToJSON(config);

    this.isGenerating = true;
    this.workflowSolutions = [];
    fetch(`/ape/run_synthesis?config_path=${domainConfig?.repo_url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(configJson),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Success:", data);
        this.workflowSolutions = data;
        this.isGenerating = false;
      })
      .catch(error => {
        console.log("Error:", error);
        this.generationError = error;
        this.isGenerating = false;
      });
  }

  loadImage(solution: WorkflowSolution) {
    const { run_id, figure_name } = solution;
    fetch(`/ ape / get_image ? run_id = ${run_id} & file_name=${figure_name}`)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        solution.image = url;
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error, display fallback image, or show error message
      });
  }
}

const exploreDataStore = new ExploreDataStore();
export default exploreDataStore;
