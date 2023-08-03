
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
  type: BenchmarkType,
  goodValue?: number,
  badValue?: number
}

export interface BenchmarkValues {
  [workflow_id: string]: {
    [benchmark_id: string]: string | number | boolean
  }
};

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
  label: 'Benchmark 1',
  type: BenchmarkType.NUMERIC,
  goodValue: 10,
  badValue: 0,
},{
  id: '2',
  label: 'Benchmark 2',
  type: BenchmarkType.BOOLEAN
},{
  id: '3',
  label: 'Benchmark 3',
  type: BenchmarkType.STRING,
}];


const sampleBenchmarkValues: BenchmarkValues = {
  [sampleWorkflows[0].id]: { 
    [sampleBenchmarks[0].id]: 3,
    [sampleBenchmarks[1].id]: true,
    [sampleBenchmarks[2].id]: 'hello'
  },
  [sampleWorkflows[1].id]: {
    [sampleBenchmarks[0].id]: 8,
    [sampleBenchmarks[1].id]: false,
    [sampleBenchmarks[2].id]: 'world'
  }
};

export { sampleWorkflows, sampleBenchmarks, sampleBenchmarkValues };

