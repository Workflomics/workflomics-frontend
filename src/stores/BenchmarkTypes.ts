
import domainStore from './DomainStore';
import { Workflow } from './WorkflowTypes';

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

const sampleWorkflows: Workflow[] = [{
  id: '1',
  label: 'Workflow 1',
  domain: domainStore.availableDomains[1],
  lengths: [1, 2, 3],
  time: '1 hour',
  benchMarkCount: 10,
  benchMarkTotal: 100,
  method: 'Method 1',
},
{
  id: '2',
  label: 'Workflow 2',
  domain: domainStore.availableDomains[1],
  lengths: [2, 3, 4],
  time: '2 hours',
  benchMarkCount: 20,
  benchMarkTotal: 200,
  method: 'Method 2',
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
  label: 'UseGalaxyEU % availability?',
  type: BenchmarkType.NUMERIC
}];


const sampleBenchmarkTable: BenchmarkTable = {
  [sampleWorkflows[0].id]: { 
    [sampleBenchmarks[0].id]: {value: 3, desirabilityValue: 0.3},
    [sampleBenchmarks[1].id]: {value: 3, desirabilityValue: 1.0},
    [sampleBenchmarks[2].id]: {value: 42, desirabilityValue: 0.42},
    [sampleBenchmarks[3].id]: {value: 87, desirabilityValue: 1.0}
  },
  [sampleWorkflows[1].id]: {
    [sampleBenchmarks[0].id]: {value: 8, desirabilityValue: 0.8},
    [sampleBenchmarks[1].id]: {value: 4, desirabilityValue: 0.5},
    [sampleBenchmarks[2].id]: {value: 0, desirabilityValue: 0.0},
    [sampleBenchmarks[3].id]: {value: 50, desirabilityValue: 0.5}
  }
};

export { sampleWorkflows, sampleBenchmarks, sampleBenchmarkTable };

