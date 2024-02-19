import { makeAutoObservable } from "mobx";
import { ConstraintInstance, WorkflowConfig, WorkflowSolution, isTaxParameterComplete as isTaxParameterComplete } from "./WorkflowTypes";
import { makePersistable } from "mobx-persist-store";
import { ApeTaxTuple } from "./TaxStore";

const emptyWorkflowConfig = () => {
  return {
    domain: undefined,
    inputs: [
      {
        "http://edamontology.org/data_0006": { id: "http://edamontology.org/data_0943", label: "Mass spectrum", root: "http://edamontology.org/data_0006", subsets: [] },
        "http://edamontology.org/format_1915": { id: "http://edamontology.org/format_3244", label: "mzML", root: "http://edamontology.org/format_1915", subsets: [] },
      },
      {
        "http://edamontology.org/data_0006": { id: "http://edamontology.org/data_2976", label: "Protein sequence", root: "http://edamontology.org/data_0006", subsets: [] },
        "http://edamontology.org/format_1915": { id: "http://edamontology.org/format_1929", label: "FASTA", root: "http://edamontology.org/format_1915", subsets: [] },
      }
    ],
    outputs: [
      {
        "http://edamontology.org/data_0006": { id: "http://edamontology.org/data_0006", label: "Data", root: "http://edamontology.org/data_0006", subsets: [] },
        "http://edamontology.org/format_1915": { id: "http://edamontology.org/format_3747", label: "protXML", root: "http://edamontology.org/format_1915", subsets: [] },
      }
    ],
    constraints: [{id: "", label: "", parameters: []} as ConstraintInstance],
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
  selectedWorkflowSolutions: WorkflowSolution[] = [];
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
      .map(this.parameterToJSON);
  }

  /**
   * Returns a JSON representation of a TaxParameter that can be used in a workflow config.
   * @param param taxonomy parameter
   * @returns JSON representation of the parameter
   */
  parameterToJSON(param: ApeTaxTuple) {
    return Object.entries(param).reduce(
      (obj, [key, data]) => { return { ...obj, [key]: [data.id] } }, {}
    );
  }


  /**
   * Returns a JSON representation of a list of constraints that can be used in a workflow config.
   * @param allConstraints list of constraints
   * @returns JSON representation of the constraints
   */
  constraintsToJSON(allConstraints: ConstraintInstance[]) {
    const newConst =  allConstraints.filter(constraint => constraint.id != "")
      .map((constraint) => {
        return {
          "constraintid": constraint!.id,
          "parameters": constraint!.parameters.map(this.parameterToJSON
          //TODO: how to pass the parameters?
            // param => Object.entries(param).reduce(
            //   (obj, [key, data]) => { return { ...obj, [key]: data.id} }, {}
            // )
          )
          // "parameters": value!.parameters.map(this.parameterToJSON)
        };
      });
    newConst.push({
      "constraintid": "not_connected_op",
      "parameters": [
        {
          "operation_0004": [
            "PeptideProphet"
          ]
        },
        {
          "operation_0004": [
            "PeptideProphet"
          ]
        }
      ]
    });
    newConst.push({
      "constraintid": "not_connected_op",
      "parameters": [
        {
          "operation_0004": [
            "operation_0335"
          ]
        },
        {
          "operation_0004": [
            "operation_0335"
          ]
        }
      ]
    });
    return newConst;
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
      "use_all_generated_data": "one",
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
    fetch(`/ape/run_synthesis_and_bench`, {
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
        this.workflowSolutions.forEach(solution => {
          solution.isSelected = true;
          this.loadImage(solution);
          this.loadBenchmarkData(solution);
        });
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
    const request = {
      run_id: run_id,
      format: "svg",
      file_name: figure_name
    }
    fetch('/ape/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })
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

  loadBenchmarkData(solution: WorkflowSolution) {
    const { run_id, benchmark_file } = solution;
    fetch(`/ape/design_time_benchmarks?run_id=${run_id}&file_name=${benchmark_file}`)
      .then(response => response.json())
      .then(data => {
        solution.benchmarkData = data;
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error, display fallback image, or show error message
      });
  }
}

const exploreDataStore = new ExploreDataStore();
export default exploreDataStore;
