import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { BenchmarkValue, BenchmarkRun } from '../../stores/BenchmarkTypes';
import { mapValueToColor } from '../../utils';
import './VisualizeBenchmarks.css';

const VisualizeBenchmark: React.FC<any> = observer((props) => {
  const [benchmarkValues, setBenchmarkValues] = React.useState<BenchmarkRun[]>([]);
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

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
    const bgColor = isWorkflow ? 'beige' : 'white';
    return (<tr key={key}>
      {/* Expand button */}
      <td style={{padding: "8px", backgroundColor: bgColor}}>{isWorkflow ? 
        (<button className='btn btn-primary btn-square btn-sm' onClick={() => handleExpand(key)}>{isExpanded ? '-' : '+'}</button>) : []}</td>

      {/* Workflow / tool label */}
      <td style={{padding: "8px", backgroundColor: bgColor}}>{label}</td>

      {/* Benchmark values */}
      { benchmarkValues.map((bmv: BenchmarkValue, index: number) => {
        const color = mapValueToColor(bmv.desirability);
        const tooltip = bmv.tooltip;
        return (<td key={index} style={{textAlign: "center", padding: "8px", backgroundColor: bgColor}}>
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
                  {benchmark.title}
                  {benchmark.unit ? <span> ({benchmark.unit})</span> : ''}
                </th>))
              }
            </tr>
          </thead>
          <tbody>
          { benchmarkValues.map(workflow => {
            const rows = [];

            // First row is the aggregated values
            const aggregateBenchmarkValues = workflow.benchmarks.map((benchmark) => {
              return {
                label: benchmark.title,
                value: benchmark.aggregate_value.value,
                desirability: benchmark.aggregate_value.desirability,
              };
            });
            const rowKey: string = `${workflow.workflowName}-aggregated`;
            rows.push(tableRow(workflow.workflowName, rowKey, aggregateBenchmarkValues, true));

            if (expandedRows[rowKey]) {
              // For every component in the workflow, collect the benchmark values (they are stored benchmark-first)
              const workflowLength = workflow.benchmarks[0].steps.length;
              for (let i = 0; i < workflowLength; i++) {
                const benchmarkValues = workflow.benchmarks.map(benchmark => benchmark.steps[i]);
                const benchmarkLabel = benchmarkValues[0].label as string;
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
