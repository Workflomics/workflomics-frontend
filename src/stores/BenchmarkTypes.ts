
export type TechBenchmark2 = {
  workflowName: string,
  executor: string,
  runID: string,
  inputs: {
    [input_id: string]: {
      filename: string
    }
  },
  benchmarks: TechBenchmarkValue[]
}

export type TechBenchmarkValue = {
  benchmark_title: string,
  benchmark_long_title: string,
  benchmark_description: string,
  benchmark_unit: string,
  value: string | number | boolean,
  desirability_value: number,
  steps: BenchmarkValue[],
}

export type TechBenchmarks = {
  workflow_name: string,
  benchmarks: TechBenchmarkValue[]
}

export enum BenchmarkType {
  NUMERIC,
  BOOLEAN,
  STRING,
}

export type Benchmark = {
  id: string,
  label: string,
  type: BenchmarkType, // not sure if this adds much
}

export type BenchmarkValue = {
  description: string,
  value: string | number | boolean,
  desirability_value: number,  // A number between 0 and 1 that will be used to calculate the color
  detailed_value: string | undefined, // A string that will be displayed in the tooltip
}

export interface BenchmarkTable {
  [workflow_id: string]: {
    [benchmark_id: string]: BenchmarkValue
  }
};

