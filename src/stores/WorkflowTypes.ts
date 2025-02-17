import { DesigntimeBenchmarks } from "./BenchmarkTypes";
import { Domain } from "./DomainStore";
import { ApeTaxTuple } from "./TaxStore";
import { ConstraintInstance } from "./ConstraintStore";

export function isTaxParameterComplete(taxParam: ApeTaxTuple): boolean {
  return Object.entries(taxParam).reduce((complete, [key, data]) => {
    return complete && data !== undefined && data.id !== "";
  }, true);
}

/**
 * Represents the current user-selected configuration for the APE workflow generation.
 */
export type UserConfig = {

  /** The currently selected domain */
  domain: Domain | undefined

  /** The currently selected inputs, outputs, constraints */
  inputs: ApeTaxTuple[]
  outputs: ApeTaxTuple[]
  constraints: ConstraintInstance[]

  /** Other synthesis parameters */
  minSteps: number
  maxSteps: number
  timeout: number
  solutionCount: number
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
