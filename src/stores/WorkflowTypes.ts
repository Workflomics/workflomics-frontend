import { ConstraintInstance } from "./ConstraintStore";
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

export type TypeFormatTuple = [InputOutputTypes | undefined, InputOutputFormats | undefined];

export type WorkflowConfig = {
  domain: Domain | undefined
  inputs: TypeFormatTuple[]
  outputs: TypeFormatTuple[]
  constraints: ConstraintInstance[]
  //order: ...
  minSteps: Number
  maxSteps: Number
  timeout: Number
  solutionCount: Number
}

export type InputOutputTypes = {
  id: string,
  label: string
}

export type InputOutputFormats = {
  id: string,
  label: string
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
