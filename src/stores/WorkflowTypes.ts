import { DesigntimeBenchmarks } from "./BenchmarkTypes";
import { Domain } from "./DomainStore";
import { ApeTaxTuple } from "./TaxStore";

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
  run_id: string,
  workflow_length: number,
  workflow_name: string,
  descriptive_name: string,
  description: string,
  cwl_name: string,
  figure_name: string,
  benchmark_file: string,
  isSelected: boolean,
  image: string | undefined,
  benchmarkData: DesigntimeBenchmarks | undefined
}
