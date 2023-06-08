import { makeAutoObservable } from "mobx";
import { ConstraintInstance, TypeFormatTuple, WorkflowConfig, WorkflowSolution } from "./WorkflowTypes";
import { makePersistable } from "mobx-persist-store";

const emptyWorkflowConfig = () => {
  return {
    domain: undefined,
    inputs: [ [{id:"data_0943",label:"default"}, {id:"format_3244",label:"default"}] as TypeFormatTuple,
              [{id:"data_2976",label:"default"}, {id:"format_1929",label:"default"}] as TypeFormatTuple ],
    outputs: [ [{id:"data_0006",label:"default"}, {id:"format_3747",label:"default"}] as TypeFormatTuple ],
    constraints: [ {constraint: {id:"",label:""}} as ConstraintInstance ],
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

  inputsOutputsToJSON(values: TypeFormatTuple[], dataRoot: string, formatRoot: string) {
    return values.filter(value => value[0] !== undefined && value[1] !== undefined && value[0]!.id !== "" && value[1]!.id !== "")
      .map((value) => {
        return {
          [dataRoot]: [value[0]!.id.replace("http://edamontology.org/", "")],
          [formatRoot]: [value[1]!.id.replace("http://edamontology.org/", "")]
        };
    });
  }

  configToJSON(config: WorkflowConfig): any {
    const dataRoot: string = "data_0006";
    const formatRoot: string = "format_1915";
    const toolsRoot: string = "operation_0004";

    const inputs = this.inputsOutputsToJSON(config.inputs, dataRoot, formatRoot);
    const outputs = this.inputsOutputsToJSON(config.outputs, dataRoot, formatRoot);
    
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
      "constraints_path": "https://raw.githubusercontent.com/Workflomics/domain-annotations/main/WombatP_tools/constraints.json",
      "timeout_sec": config.timeout,
      "solutions_dir_path": "https://raw.githubusercontent.com/Workflomics/domain-annotations/main/WombatP_tools/",
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
      "outputs": outputs
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
    fetch(`/ape/get_image?run_id=${run_id}&file_name=${figure_name}`)
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
