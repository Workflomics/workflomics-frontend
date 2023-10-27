
import { WorkflowSolution } from './WorkflowTypes';


export type TechBenchmarkValue = {
  benchmark_title: string,
  benchmark_long_title: string,
  benchmark_description: string,
  value: string | number | boolean,
  desirability_value: number,
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
  value: string | number | boolean,
  desirabilityValue: number,  // A number between 0 and 1 that will be used to calculate the color
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
    [sampleBenchmarks[0].id]: {value: 3, desirabilityValue: 0.3},
    [sampleBenchmarks[1].id]: {value: 3, desirabilityValue: 1.0},
    [sampleBenchmarks[2].id]: {value: 42, desirabilityValue: 0.42},
    [sampleBenchmarks[3].id]: {value: 87, desirabilityValue: 1.0}
  },
  [sampleWorkflows[1].run_id]: {
    [sampleBenchmarks[0].id]: {value: 8, desirabilityValue: 0.8},
    [sampleBenchmarks[1].id]: {value: 4, desirabilityValue: 0.5},
    [sampleBenchmarks[2].id]: {value: 0, desirabilityValue: 0.0},
    [sampleBenchmarks[3].id]: {value: 50, desirabilityValue: 0.5}
  }
};

export { sampleWorkflows, sampleBenchmarks, sampleBenchmarkTable };

