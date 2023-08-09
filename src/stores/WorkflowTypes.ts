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
 * Represents an array containing DataType and DataFormat as elements.
 */
export type InOutTuple = [DataType | undefined, DataFormat | undefined];

/**
 * Represents a configuration for a workflow.
 */
export type WorkflowConfig = {
  domain: Domain | undefined
  inputs: InOutTuple[]
  outputs: InOutTuple[]
  constraints: ConstraintInstance[]
  //order: ...
  minSteps: Number
  maxSteps: Number
  timeout: Number
  solutionCount: Number
}

/**
 * Represents a type that can be an operation.
 */
export type Operation = {
  id: string,
  label: string,
  root: string
}

/**
 * Represents a type that can be a data type.
 */
export type DataType = {
  id: string,
  label: string,
  root: string
}

/**
 * Represents a type that can be a data format.
 */
export type DataFormat = {
  id: string,
  label: string,
  root: string
}

export type ConstraintInstance = {
  id: string,
  label: string,
  parameters: (Operation | InOutTuple)[]
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
