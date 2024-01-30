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
              <th>Workflow length</th>
              <th>Executed steps</th>
              <th>Number of proteins</th>
              <th>Availability</th>

              {/* { benchmarks.map(benchmark => (<th key={benchmark.id}>{benchmark.label}</th>)) } */}
            </tr>
          </thead>
          <tbody>
          { benchmarkValues.map(workflow => {
            const key = workflow.workflowName;
            // Look up the benchmark values for this workflow
            const bmValues = benchmarkValues.find(bm => bm.workflowName === key);
            if (!bmValues) {
              return (<tr key={workflow.workflowName}>
                <td>{ workflow.workflowName }</td>
                <td>No benchmark values found</td>
              </tr>);
            }
            return (<tr key={workflow.workflowName}>
              <td>{ workflow.workflowName }</td>
              { bmValues.benchmarks.map((bm: TechBenchmarkValue) => {
                const color = mapValueToColor(bm.desirability_value);
                return (<td key={key} style={{backgroundColor: color}}>{bm.value.toString()}</td>);
              })}
            </tr>);
          })}
          </tbody>
        </table>
      </div>
    </div>
  </div>);
});

export { VisualizeBenchmark };
