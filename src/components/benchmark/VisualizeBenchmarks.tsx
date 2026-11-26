import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { BenchmarkValue, BenchmarkRun } from '../../stores/BenchmarkTypes';
import { mapDesirabilityToColor } from '../../utils';
import './VisualizeBenchmarks.css';

type SortDirection = 'ascending' | 'descending';
type SortState =
  | { column: number; direction: SortDirection }
  | { column: number; direction: 'target'; target: number };

const numericValue = (value: BenchmarkValue['value'] | undefined): number | undefined => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string' && value.trim() !== '') {
    const number = Number(value);
    return Number.isFinite(number) ? number : undefined;
  }
  return undefined;
};

const sortValue = (value: BenchmarkValue['value']): { rank: number; value: number | string } => {
  if (typeof value === 'boolean') {
    return { rank: 1, value: Number(value) };
  }
  const number = numericValue(value);
  if (number !== undefined) return { rank: 0, value: number };
  return { rank: 2, value: String(value) };
};

const compareValues = (a: BenchmarkValue['value'], b: BenchmarkValue['value']) => {
  const left = sortValue(a);
  const right = sortValue(b);
  if (left.rank !== right.rank) return left.rank - right.rank;
  if (typeof left.value === 'number' && typeof right.value === 'number') {
    return left.value < right.value ? -1 : left.value > right.value ? 1 : 0;
  }
  return String(left.value).localeCompare(String(right.value), undefined, { numeric: true });
};

const VisualizeBenchmark: React.FC<any> = observer((props) => {
  const [benchmarkValues, setBenchmarkValues] = React.useState<BenchmarkRun[]>([]);
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});
  const [sort, setSort] = React.useState<SortState | null>(null);
  const [targetColumn, setTargetColumn] = React.useState<number | null>(null);
  const [targetInputs, setTargetInputs] = React.useState<Record<number, string>>({});
  const [targetError, setTargetError] = React.useState<{ column: number; message: string } | null>(null);

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
        setExpandedRows({});
        setSort(null);
        setTargetColumn(null);
        setTargetInputs({});
        setTargetError(null);
      }
    }
  }

  const handleExpand = (rowKey: string) => {
    const newState = { ...expandedRows };
    newState[rowKey] = !newState[rowKey];
    setExpandedRows(newState);
  };

  const toggleTargetEditor = (column: number) => {
    if (targetColumn === column && !(sort?.column === column && sort.direction === 'target')) {
      setTargetColumn(null);
    } else {
      setTargetColumn(column);
      setTargetInputs(previous => ({
        ...previous,
        [column]: sort?.column === column && sort.direction === 'target' ? String(sort.target) : (previous[column] || ''),
      }));
    }
    setTargetError(null);
  };

  const applyTarget = (event: React.FormEvent<HTMLFormElement>, column: number) => {
    event.preventDefault();
    const target = numericValue(targetInputs[column] || '');
    if (target === undefined) {
      setTargetError({ column, message: 'Enter a finite numeric target.' });
      return;
    }
    setSort({ column, direction: 'target', target });
    setTargetInputs(previous => ({ ...previous, [column]: String(target) }));
    setTargetError(null);
    setTargetColumn(column);
  };

  const distanceScale = sort?.direction === 'target' &&
    (Math.abs(sort.target) > Number.MAX_VALUE / 4 ||
      benchmarkValues.some(workflow => {
        const value = numericValue(workflow.benchmarks[sort.column]?.aggregate_value?.value);
        return value !== undefined && Math.abs(value) > Number.MAX_VALUE / 4;
      })) ? 2 : 1;
  const targetDistance = (value: number, target: number) =>
    Math.abs(value / distanceScale - target / distanceScale);

  const sortedWorkflows = sort ? benchmarkValues
    .map((workflow, index) => ({ workflow, index }))
    .sort((a, b) => {
      const left = a.workflow.benchmarks[sort.column]?.aggregate_value?.value;
      const right = b.workflow.benchmarks[sort.column]?.aggregate_value?.value;
      if (sort.direction === 'target') {
        const leftNumber = numericValue(left);
        const rightNumber = numericValue(right);
        if (leftNumber === undefined || rightNumber === undefined) {
          return leftNumber === undefined && rightNumber === undefined ? a.index - b.index : leftNumber === undefined ? 1 : -1;
        }
        const leftDistance = targetDistance(leftNumber, sort.target);
        const rightDistance = targetDistance(rightNumber, sort.target);
        return (leftDistance < rightDistance ? -1 : leftDistance > rightDistance ? 1 : 0) || a.index - b.index;
      }
      if (left === undefined || right === undefined) {
        return left === undefined && right === undefined ? a.index - b.index : left === undefined ? 1 : -1;
      }
      const comparison = compareValues(left, right);
      return (sort.direction === 'ascending' ? comparison : -comparison) || a.index - b.index;
    })
    .map(({ workflow }) => workflow) : benchmarkValues;

  let closestDistance = Infinity;
  let farthestDistance = -Infinity;
  if (sort?.direction === 'target') {
    benchmarkValues.forEach(workflow => {
      const value = numericValue(workflow.benchmarks[sort.column]?.aggregate_value?.value);
      if (value !== undefined) {
        const distance = targetDistance(value, sort.target);
        closestDistance = Math.min(closestDistance, distance);
        farthestDistance = Math.max(farthestDistance, distance);
      }
    });
  }

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
        const targetSorted = isWorkflow && sort?.direction === 'target' && sort.column === index;
        const value = numericValue(bmv.value);
        let color = mapDesirabilityToColor(bmv.desirability);
        let tooltip = bmv.tooltip;
        if (targetSorted && sort.direction === 'target') {
          if (value === undefined) {
            color = mapDesirabilityToColor(0);
            tooltip = [tooltip, 'Cannot compare this value with the target.'].filter(Boolean).join(' ');
          } else {
            const distance = targetDistance(value, sort.target);
            const relativeDistance = farthestDistance === closestDistance
              ? 0
              : (distance - closestDistance) / (farthestDistance - closestDistance);
            color = mapDesirabilityToColor(1 - 2 * relativeDistance);
            tooltip = [tooltip, `Color reflects distance from target ${sort.target}, relative to these workflows.`].filter(Boolean).join(' ');
          }
        }
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
      <div className="flex justify-center tooltip" data-tip="Upload the JSON file containing run-time benchmarks generated by the workflomics benchmarker.">
        <label htmlFor="file-upload" className="btn btn-primary">Upload JSON file</label>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
      </div>

      {/* Results table */}
      <div className="overflow-x-auto text-left space-y-6 m-8 flex justify-center">
        <table className="table w-4/5 benchmark-results">
          <thead>
            <tr>
              <th></th>
              <th></th>
              { benchmarkValues[0]?.benchmarks.map((benchmark, index) => 
                (<th key={index} style={{textAlign: 'center'}} aria-sort={sort?.column === index ? (sort.direction === 'target' ? 'other' : sort.direction) : undefined}>
                  {benchmark.title}
                  {benchmark.unit ? <span> ({benchmark.unit})</span> : ''}
                  <span className="benchmark-sort-controls">
                    <button type="button" className="benchmark-sort-button"
                      aria-label={`Sort ${benchmark.title} ascending`}
                      aria-pressed={sort?.column === index && sort.direction === 'ascending'}
                      onClick={() => setSort({ column: index, direction: 'ascending' })}>▲</button>
                    <button type="button" className="benchmark-sort-button"
                      aria-label={`Sort ${benchmark.title} descending`}
                      aria-pressed={sort?.column === index && sort.direction === 'descending'}
                      onClick={() => setSort({ column: index, direction: 'descending' })}>▼</button>
                  </span>
                  {benchmark.category?.trim().toLowerCase() === 'scientific' &&
                    benchmarkValues.some(workflow => numericValue(workflow.benchmarks[index]?.aggregate_value?.value) !== undefined) && (
                    <>
                      <button type="button" className="benchmark-target-button"
                        aria-label={`Sort ${benchmark.title} by target`}
                        aria-expanded={targetColumn === index || (sort?.column === index && sort.direction === 'target')}
                        aria-pressed={sort?.column === index && sort.direction === 'target'}
                        title="Sort by distance from a target"
                        onClick={() => toggleTargetEditor(index)}>
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9" />
                          <circle cx="12" cy="12" r="5" />
                          <circle cx="12" cy="12" r="1" fill="currentColor" />
                        </svg>
                      </button>
                      {(targetColumn === index || (sort?.column === index && sort.direction === 'target')) && (
                        <form className="benchmark-target-form" onSubmit={(event) => applyTarget(event, index)} noValidate>
                          <input id={`benchmark-target-${index}`} type="number" step="any"
                            value={targetInputs[index] || ''} onChange={(event) => {
                              setTargetInputs(previous => ({ ...previous, [index]: event.target.value }));
                              setTargetError(null);
                            }}
                            aria-label={`${benchmark.title} target value${benchmark.unit ? ` (${benchmark.unit})` : ''}`}
                            title="Enter a target value and press Enter to apply"
                            placeholder="Target"
                            aria-invalid={targetError?.column === index}
                            aria-describedby={targetError?.column === index ? `benchmark-target-error-${index}` : undefined}
                            autoFocus />
                          {targetError?.column === index && <span id={`benchmark-target-error-${index}`} role="alert">{targetError.message}</span>}
                        </form>
                      )}
                    </>
                  )}
                </th>))
              }
            </tr>
          </thead>
          <tbody>
          { sortedWorkflows.map(workflow => {
            const rows = [];

            // First row is the aggregated values
            const aggregateBenchmarkValues = workflow.benchmarks.map((benchmark) => {
              return {
                label: benchmark.title,
                value: benchmark.aggregate_value.value,
                desirability: benchmark.aggregate_value.desirability,
                tooltip: benchmark.aggregate_value.tooltip,
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
