import { makeAutoObservable } from "mobx";
import { ConstraintInstance, TypeFormatTuple, WorkflowConfig } from "./WorkflowTypes";


const emptyWorkflowConfig = () => {
  return {
    domain: undefined,
    inputs: [ [{id:"",label:""}, {id:"",label:""}] as TypeFormatTuple ],
    outputs: [ [{id:"",label:""}, {id:"",label:""}] as TypeFormatTuple ],
    constraints: [ {constraint: {id:"",label:""}} as ConstraintInstance ],
    minSteps: 3,
    maxSteps: 4,
    timeout: 120,
    solutionCount: 3
  }
}

export class ExploreDataStore {

  workflowConfig: WorkflowConfig = emptyWorkflowConfig();

  constructor() {
    makeAutoObservable(this);
  }

  inputsOutputsToJSON(values: TypeFormatTuple[], dataRoot: string, formatRoot: string) {
    return values.filter(value => value[0] !== undefined && value[1] !== undefined && value[0]!.id !== "" && value[1]!.id !== "")
      .map((value) => {
        return {
          [dataRoot]: [value[0]!.id],
          [formatRoot]: [value[1]!.id]
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
    console.log(config);
    fetch(`/ape/run_synthesis?config_path=${domainConfig?.repo_url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(configJson),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response
        console.log(data);
      })
      .catch(error => {
        // Handle errors
        console.error(error);
    });
  }


}

const exploreDataStore = new ExploreDataStore();
export default exploreDataStore;
