
import { WorkflowSolution } from './WorkflowTypes';


export type TechBenchmarkValue = {
  benchmark_title: string,
  benchmark_long_title: string,
  benchmark_description: string,
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
}

export interface BenchmarkTable {
  [workflow_id: string]: {
    [benchmark_id: string]: BenchmarkValue
  }
};

// Some hard-coded sample data (workflows, benchmarks, and benchmark values)

const sampleWorkflows: WorkflowSolution[] = [{
  cwl_name: "workflow.cwl",
  run_id: '1',
  workflow_length: 3,
  name: "workflow_1",
  figure_name: "image.png",
  benchmark_file: "benchmark_1.json",
  isSelected: true,
  image: undefined,
  benchmarkData: undefined
},{
  cwl_name: "workflow2.cwl",
  run_id: '2',
  workflow_length: 4,
  name: "workflow_2",
  figure_name: "image_2.png",
  benchmark_file: "benchmark_2.json",
  isSelected: true,
  image: undefined,
  benchmarkData: undefined
}];

const sampleBenchmarks: Benchmark[] = [{
  id: '1',
  label: '# of steps',
  type: BenchmarkType.NUMERIC
},{
  id: '2',
  label: '# of executed steps',
  type: BenchmarkType.NUMERIC
},{
  id: '3',
  label: '# of identified proteins',
  type: BenchmarkType.NUMERIC,
},{
  id: '4',
  label: '% of tools on usegalaxy.eu',
  type: BenchmarkType.NUMERIC
}];


const sampleBenchmarkTable: BenchmarkTable = {
  [sampleWorkflows[0].run_id]: { 
    [sampleBenchmarks[0].id]: {description: "Sample desc 1", value: 3, desirability_value: 0.3},
    [sampleBenchmarks[1].id]: {description: "Sample desc 2", value: 3, desirability_value: 1.0},
    [sampleBenchmarks[2].id]: {description: "Sample desc 3", value: 42, desirability_value: 0.42},
    [sampleBenchmarks[3].id]: {description: "Sample desc 4", value: 87, desirability_value: 1.0}
  },
  [sampleWorkflows[1].run_id]: {
    [sampleBenchmarks[0].id]: {description: "Sample desc 5", value: 8, desirability_value: 0.8},
    [sampleBenchmarks[1].id]: {description: "Sample desc 6", value: 4, desirability_value: 0.5},
    [sampleBenchmarks[2].id]: {description: "Sample desc 7", value: 0, desirability_value: 0.0},
    [sampleBenchmarks[3].id]: {description: "Sample desc 8", value: 50, desirability_value: 0.5}
  }
};

export { sampleWorkflows, sampleBenchmarks, sampleBenchmarkTable };

