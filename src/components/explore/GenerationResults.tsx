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
      if (solution.image === undefined) {
        exploreDataStore.loadImage(solution);
      }
    });
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

  const downloadInputFile = (run_id: string) => {
    fetch(`/ape/get_cwl_input?run_id=${run_id}`)
    .then(response => response.text())
    .then(data => {
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "inputs.yml";
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
      <div className="m-20">

        {/* Results */}
        <div className="overflow-x-auto text-left space-y-6 m-8 flex justify-center">
          <table className="table w-4/5">
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Workflow length</th>
                <th>Action</th>
                {workflowSolutions.length > 0 && <th><button className="btn btn-primary" onClick={() => downloadInputFile(workflowSolutions[0].run_id)}>Download <br />CWL input file</button></th>}
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

         {/* Status messages */}
         {exploreDataStore.isGenerating && <div className="alert alert-info">Generating workflows...</div>}
        { ! exploreDataStore.isGenerating && ! exploreDataStore.generationError && <div className="alert alert-warning"> No solutions were found for given specification. Try a different a specification (e.g., change  maximum workflow length, expected inputs and/or outputs, or remove some constraints). </div> }
        { exploreDataStore.generationError && <div className="alert alert-error">An error occurred while generating the workflows: {exploreDataStore.generationError.toString()}</div> }

        
        {/* Selected solutions */}
        <div className="flex justify-center gap-8">
            { workflowSolutions.filter((solution: WorkflowSolution) => solution.isSelected)
                .map((solution: WorkflowSolution, index: number) => (
              <div key={index} className="border-2 border-red-200 rounded-xl overflow-hidden p-2 shadow-lg">
                <div className="m-4 text-xl"><span>Solution: { solution.name }</span></div>
                { (solution.image != null) && <img src={solution.image} alt={solution.name} /> }
              </div>
            ))}
          </div>
      </div>
    </div>
  );
});

export { GenerationResults };
