import { Domain } from "./DomainData";

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


export type WorkflowConfig = {
  inputs: [ [InputOutputTypes, InputOutputFormats] ]
  outputs: [ [InputOutputTypes, InputOutputFormats] ]
  //constraints: Constraint[]
  //order: ...
  minSteps: Number,
  maxSteps: Number,
  timeout: Number,
  solutionCount: Number
}

//TODO: this will be different for each domain?
export type InputOutputTypes = {
  label: string
  //...
}

export enum InputOutputFormats {
  JSON = "JSON",
  XML = "XML",
  TEXT = "Text file",
  HTML = "HTML"
}
