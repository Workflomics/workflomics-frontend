import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { BenchmarkValue, TechBenchmark2 } from '../../stores/BenchmarkTypes';
import * as d3 from 'd3';
import './VisualizeBenchmarks.css';

const VisualizeBenchmark: React.FC<any> = observer((props) => {
  const [benchmarkValues, setBenchmarkValues] = React.useState<TechBenchmark2[]>([]);
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

  function mapValueToColor(value: number) {
    const colorScale = d3.scaleQuantize<string>()
      .domain([0, 1])
      .range(["#ffffff", "#c0e6cb", "#7fcc99", "#28b168"]);
    const limitRange = d3.scaleLinear()
      .domain([0, 1])
      .range([0.2, 0.8]);
    const color = colorScale(limitRange(value));
    return color;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Read and parse file
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        const content = evt.target?.result;
        const obj = JSON.parse(content as string);
        setBenchmarkValues(obj);
      }
    }
  }

  const handleExpand = (rowKey: string) => {
    const newState = { ...expandedRows };
    newState[rowKey] = !newState[rowKey];
    setExpandedRows(newState);
  };

  const tableRow = (label: string, key: string, benchmarkValues: BenchmarkValue[], isWorkflow: boolean) => {
    const isExpanded: boolean = expandedRows[key];
    return (<tr key={key}>
      {/* Expand button */}
      <td style={{padding: "8px"}}>{isWorkflow ? 
        (<button className='btn btn-primary btn-square btn-sm' onClick={() => handleExpand(key)}>{isExpanded ? '-' : '+'}</button>) : []}</td>

      {/* Workflow / tool label */}
      <td style={{padding: "8px"}}>{label}</td>

      {/* Benchmark values */}
      { benchmarkValues.map((bmv: BenchmarkValue, index: number) => {
        const color = mapValueToColor(bmv.desirability_value);
        const tooltip = bmv.detailed_value;
        return (<td key={index} style={{textAlign: "center", padding: "8px"}}>
          <span style={{backgroundColor: color}} 
                className={`benchmark-value ${tooltip ? 'tooltip' : ''}`}
                {...(tooltip ? { 'data-tip': tooltip } : {})}>
            {bmv.value.toString()}
          </span>
        </td>);
      })}
    </tr>);
  }

  return (<div>
    <div className="m-20">

      {/* Upload button for json file */}
      <div className="flex justify-center">
        <label htmlFor="file-upload" className="btn btn-primary">Upload JSON file</label>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
      </div>

      {/* Results table */}
      <div className="overflow-x-auto text-left space-y-6 m-8 flex justify-center">
        <table className="table w-4/5">
          <thead>
            <tr>
              <th></th>
              <th></th>
              { benchmarkValues[0]?.benchmarks.map((benchmark, index) => 
                (<th key={index} style={{textAlign: 'center'}}>
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
                desirability_value: benchmark.desirability_value,
                detailed_value: "",
              };
            });
            const rowKey: string = `${workflow.workflowName}-aggregated`;
            rows.push(tableRow(workflow.workflowName, rowKey, topBenchmarkValues, true));

            if (expandedRows[rowKey]) {
              // For every component in the workflow, collect the benchmark values (they are stored benchmark-first)
              const workflowLength = workflow.benchmarks[0].steps.length;
              for (let i = 0; i < workflowLength; i++) {
                const benchmarkValues = workflow.benchmarks.map(benchmark => benchmark.steps[i]);
                const benchmarkLabel = benchmarkValues[0].description;
                const key = `${workflow.workflowName}-${benchmarkLabel}`;
                rows.push(tableRow(benchmarkLabel, key, benchmarkValues, false));
              }
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
