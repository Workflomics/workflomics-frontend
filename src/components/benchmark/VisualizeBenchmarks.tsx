import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Benchmark, BenchmarkValues, sampleBenchmarkValues, sampleBenchmarks, sampleWorkflows } from '../../stores/BenchmarkTypes';
import { Workflow } from '../../stores/WorkflowTypes';
import * as d3 from 'd3';

const VisualizeBenchmark: React.FC<any> = observer((props) => {
  const benchmarkValues: BenchmarkValues = sampleBenchmarkValues;
  const workflows: Workflow[] = sampleWorkflows;
  const benchmarks: Benchmark[] = sampleBenchmarks;

  function mapValueToColor(value: number, minValue: number, maxValue: number) {
    const colorScale = d3.scaleSequential()
      .domain([minValue, maxValue])
      .interpolator(d3.interpolateRdYlGn);
    const color = colorScale(value);
    return color;
  }

return (<div>
    <div className="m-20">
      <div className="overflow-x-auto text-left space-y-6 m-8 flex justify-center">
        <table className="table w-4/5">
          <thead>
            <tr>
              <th></th>
              { workflows.map(workflow => (<th key={workflow.id}>{workflow.label}</th>)) }
            </tr>
          </thead>
          <tbody>
          { benchmarks.map(benchmark => (
            <tr key={benchmark.id}>
              <td>{ benchmark.label }</td>
              { workflows.map(workflow => {
                const value = benchmarkValues[workflow.id][benchmark.id];
                let color = 'lightblue';
                if (typeof value === 'number') {
                  color = mapValueToColor(value, benchmark.badValue || 0, benchmark.goodValue || 1);
                }
                return (<td key={workflow.id} style={{backgroundColor: color}}>{value.toString()}</td>);
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
