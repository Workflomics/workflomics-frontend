import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Benchmark, BenchmarkValue, BenchmarkTable, sampleBenchmarks, TechBenchmark2, TechBenchmarkValue } from '../../stores/BenchmarkTypes';
import { WorkflowSolution } from '../../stores/WorkflowTypes';
import * as d3 from 'd3';
import { useStore } from '../../store';

const VisualizeBenchmark: React.FC<any> = observer((props) => {
  const { exploreDataStore } = useStore();
  const workflows: WorkflowSolution[] = exploreDataStore.selectedWorkflowSolutions;
  const [benchmarkValues, setBenchmarkValues] = React.useState<TechBenchmark2[]>([]);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Convert file to json
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        const content = evt.target?.result;
        const json = JSON.parse(content as string);
        console.log(json);
        setBenchmarkValues(json);
      }
    }
  }

  const tableRow = (label: string, key: string, benchmarkValues: BenchmarkValue[]) => {
    return (<tr key={key}>
      <td>{label}</td>
      { benchmarkValues.map((bmv: BenchmarkValue, index: number) => {
        const color = mapValueToColor(bmv.desirability_value);
        return (<td key={index} style={{backgroundColor: color}}>{bmv.value.toString()}</td>);
      })}
    </tr>);
  }

  return (<div>
    <div className="m-20">

      {/* Upload button for json file */}
      <div className="flex justify-center">
        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
          <span>Upload JSON file</span>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
        </label>
      </div>

      {/* Results table */}
      <div className="overflow-x-auto text-left space-y-6 m-8 flex justify-center">
        <table className="table w-4/5">
          <thead>
            <tr>
              <th></th>
              { benchmarkValues[0]?.benchmarks.map((benchmark, index) => 
                (<th key={index}>
                  {benchmark.benchmark_title}
                  {benchmark.benchmark_unit ? <span> ({benchmark.benchmark_unit})</span> : ''}
                </th>))
              }
            </tr>
          </thead>
          <tbody>
          { benchmarkValues.map(workflow => {
            const rows = [];
            // First row is the aggregated values
            const topBenchmarkValues = workflow.benchmarks.map((benchmark) => {
              return {
                description: benchmark.benchmark_title,
                value: benchmark.value,
                desirability_value: benchmark.desirability_value
              };
            });
            rows.push(tableRow(workflow.workflowName, `${workflow.workflowName}-aggregated`, topBenchmarkValues));

            // For every component in the workflow, collect the benchmark values (they are stored benchmark-first)
            const workflowLength = workflow.benchmarks[0].steps.length;
            for (let i = 0; i < workflowLength; i++) {
              const benchmarkValues = workflow.benchmarks.map(benchmark => benchmark.steps[i]);
              const benchmarkLabel = benchmarkValues[0].description;
              const key = `${workflow.workflowName}-${benchmarkLabel}`;
              rows.push(tableRow(benchmarkLabel, key, benchmarkValues));
            }
            return <React.Fragment key={workflow.workflowName}>{rows}</React.Fragment>;
          })}
          </tbody>
        </table>
      </div>
    </div>
  </div>);
});

export { VisualizeBenchmark };
