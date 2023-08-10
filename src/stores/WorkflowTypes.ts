import { ConstraintTemplate } from "./ConstraintStore";
import { Domain } from "./DomainStore";

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

/**
 * Represents an APE lib parameter, either a data parameter (usually a pair of DataType and DataFormat) or a operation parameter.
 */
export type TaxParameter = Map<string, TaxonomyClass>;

/**
 * Instance that represent a class in the taxonomy (data or operation).
 */
export type TaxonomyClass = {
  id: string,
  label: string,
  root: string
}

export function isTaxParameterComplete(taxParam: TaxParameter): boolean {
  const complete: boolean = true;
  Array.from(taxParam.entries()).map(([key, data]) => ({
    complete: complete && data !== undefined && data.id !== ""
  }));

  return complete;
}

/**
 * Represents a configuration for a workflow.
 */
export type WorkflowConfig = {
  domain: Domain | undefined
  inputs: TaxParameter[]
  outputs: TaxParameter[]
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
  parameters: TaxParameter[]
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
