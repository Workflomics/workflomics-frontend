import { Domain } from "./DomainStore";
import { ApeTaxTuple } from "./TaxStore";

// Currently unused
export type Workflow = {
  id: string;
  label: string;
  domain: Domain;
  lengths: Number[]; //TODO: what type is this?
  time: string;
  benchMarkCount: Number;
  benchMarkTotal: Number;
  method: string;
}

export function isTaxParameterComplete(taxParam: ApeTaxTuple): boolean {
  return Object.entries(taxParam).reduce((complete, [key, data]) => {
    return complete && data !== undefined && data.id !== "";
  }, true);
}

/**
 * Represents a configuration for a workflow.
 */
export type WorkflowConfig = {
  domain: Domain | undefined
  inputs: ApeTaxTuple[]
  outputs: ApeTaxTuple[]
  constraints: ConstraintInstance[]
  //order: ...
  minSteps: Number
  maxSteps: Number
  timeout: Number
  solutionCount: Number
}

export type ConstraintInstance = {
  id: string,
  label: string,
  parameters: ApeTaxTuple[]
}

export type WorkflowSolution = {
  cwl_name: string,
  run_id: string,
  workflow_length: Number,
  name: string,
  figure_name: string,
  isSelected: boolean,
  image: string | undefined
}
