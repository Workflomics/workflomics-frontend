export type BenchmarkRun = {
  workflowName: string;
  executor: string;
  runID: string;
  inputs: {
    [input_id: string]: {
      filename: string;
    };
  };
  benchmarks: WorkflowBenchmark[];
};

export type WorkflowBenchmark = {
  title: string;
  description: string;
  unit: string;
  aggregate_value: BenchmarkValue;
  steps: BenchmarkValue[];
};

export type BenchmarkValue = {
  label?: string;
  value: string | number | boolean;
  desirability: number; // A number between -1 and 1 that will be used to calculate the color
  tooltip?: string;
};

export type DesigntimeBenchmarks = {
  workflow_name: string;
  benchmarks: WorkflowBenchmark[];
};
