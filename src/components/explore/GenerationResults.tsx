import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { useStore } from '../../store';
import { WorkflowSolution } from '../../stores/WorkflowTypes';
import { runInAction } from 'mobx';

const GenerationResults: React.FC<any> = observer((props) => {
  const { exploreDataStore } = useStore();
  const workflowSolutions = exploreDataStore.workflowSolutions;

  const handleSelected = (solution: WorkflowSolution, event: React.ChangeEvent<HTMLInputElement>) => {
    runInAction(() => {
      solution.isSelected = event.target.checked;
    });
    console.log(solution.isSelected);
  };

  const downloadFile = (run_id: string, cwl_name: string) => {
    fetch(`/ape/get_cwl?run_id=${run_id}&file_name=${cwl_name}`)
    .then(response => response.text())
    .then(data => {
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = cwl_name;
      link.click();
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    <div>

      <ExplorationProgress index={4} />

      <div className="m-8">
        <div className="overflow-x-auto text-left space-y-6 mt-10 flex justify-center">

          {/* Status messages */}
          { exploreDataStore.isGenerating && <div className="alert alert-info">Generating workflows...</div> }

          {/* Results */}
          <table className="table w-4/5">
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Workflow length</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            { workflowSolutions.map((solution: WorkflowSolution, index: number) => (
              <tr key={index}>
                <td><input type="checkbox" className="h-6 w-6" defaultChecked={solution.isSelected} 
                    onChange={(event) => { handleSelected(solution, event) }}/></td>
                <td>{ solution.name }</td>
                <td>{ `${solution.workflow_length}` }</td>
                <td><button className="btn btn-primary" onClick={() => downloadFile(solution.run_id, solution.cwl_name)}>Download CWL</button></td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Selected solutions */}
        <div>
            { workflowSolutions.filter((solution: WorkflowSolution) => solution.isSelected)
                .map((solution: WorkflowSolution, index: number) => (
              <div key={index}>solution: { solution.name }</div>
            ))}
          </div>
      </div>
    </div>
  );
});

export { GenerationResults };
