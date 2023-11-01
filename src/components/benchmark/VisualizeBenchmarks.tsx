import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Benchmark, BenchmarkValue, BenchmarkTable, sampleBenchmarks } from '../../stores/BenchmarkTypes';
import { WorkflowSolution } from '../../stores/WorkflowTypes';
import * as d3 from 'd3';
import { useStore } from '../../store';

const VisualizeBenchmark: React.FC<any> = observer((props) => {
  const { exploreDataStore } = useStore();
  const workflows: WorkflowSolution[] = exploreDataStore.selectedWorkflowSolutions;
  const benchmarks: Benchmark[] = sampleBenchmarks;

  function mapValueToColor(value: number) {
    const colorScale = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateRdYlGn);
    const limitRange = d3.scaleLinear()
      .domain([0, 1])
      .range([0.2, 0.8]);
    const color = colorScale(limitRange(value));
    return color;
  }

  // Generate random benchmark values
  const benchmarkValues: BenchmarkTable = {};
  workflows.forEach((workflow: WorkflowSolution, index: number) => {
    const n_proteins = Math.floor(Math.random() * 100);
    const availability = Math.floor(Math.random() * 100);
    const executedSteps = Math.floor(Math.random() * (workflow.workflow_length + 1));
    benchmarkValues[workflow.name] = {
      '1': {description: "Sample desc 1", value: workflow.workflow_length, desirability_value: (workflow.workflow_length / 10.0)} as BenchmarkValue,
      '2': {description: "Sample desc 2", value: executedSteps, desirability_value: (executedSteps) / workflow.workflow_length} as BenchmarkValue,
      '3': {description: "Sample desc 3", value: n_proteins, desirability_value: 0.01 * n_proteins} as BenchmarkValue,
      '4': {description: "Sample desc 4", value: availability, desirability_value: 0.01 * availability} as BenchmarkValue
    };
  });

  return (<div>
    <div className="m-20">
      <div className="overflow-x-auto text-left space-y-6 m-8 flex justify-center">
        <table className="table w-4/5">
          <thead>
            <tr>
              <th></th>
              { benchmarks.map(benchmark => (<th key={benchmark.id}>{benchmark.label}</th>)) }
            </tr>
          </thead>
          <tbody>
          { workflows.map(workflow => (
            <tr key={workflow.name}>
              <td>{ workflow.name }</td>
              { benchmarks.map(benchmark => {
                const key = `${workflow.name}-${benchmark.id}`;
                const bmValue: BenchmarkValue = benchmarkValues[workflow.name][benchmark.id];
                const color = mapValueToColor(bmValue.desirability_value);
                return (<td key={key} style={{backgroundColor: color}}>{bmValue.value.toString()}</td>);
              })}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>);
});

export { VisualizeBenchmark };
