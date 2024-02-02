import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { useStore } from '../../store';
import { WorkflowSolution } from '../../stores/WorkflowTypes';
import { runInAction } from 'mobx';
import { useNavigate } from 'react-router-dom';
import './HorizontalScroll.css'; 
import { TechBenchmarkValue, TechBenchmarks } from '../../stores/BenchmarkTypes';
import Icon from '@mdi/react';
import { mdiDownload, mdiEyeOff } from '@mdi/js';

const GenerationResults: React.FC<any> = observer((props) => {
  const navigate = useNavigate();
  const { exploreDataStore } = useStore();
  const workflowSolutions = exploreDataStore.workflowSolutions;
  const [doShowTechBenchmarks, setShowTechBenchmarks] = React.useState(false);
  const [solutionModalOpen, setSolutionModalOpen] = React.useState(false);
  const [modalSolution, setModalSolution] = React.useState(workflowSolutions[0]);

  const handleSelected = (workflow: WorkflowSolution, checked: boolean) => {
    runInAction(() => {
      workflow.isSelected = checked;
      if (checked && workflow.image === undefined) {
        exploreDataStore.loadImage(workflow);
      }
      if (checked && workflow.benchmarkData === undefined) {
        exploreDataStore.loadBenchmarkData(workflow);
      }
    });
  };

  const toggleAll = (checked: boolean) => {
    runInAction(() => {
      workflowSolutions.map((solution, _) => handleSelected(solution, checked))
    });
  };

  const downloadFile = (run_id: string, cwl_name: string) => {
    fetch(`/ape/cwl?run_id=${run_id}&file_name=${cwl_name}`)
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
      console.error('There has been a problem with accessing a cwl file from the REST APE service:', error);
    });
  }

  const downloadInputFile = (run_id: string) => {
    fetch(`/ape/cwl_input?run_id=${run_id}`)
    .then(response => response.text())
    .then(data => {
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "input.yml";
      link.click();
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('There has been a problem with accessing cwl input file from the REST APE service:', error);
    });
  }

  const downloadSelectedWorkflows = () => {
    const selectedWorkflows: WorkflowSolution[] = workflowSolutions.filter(
      (workflow: WorkflowSolution) => workflow.isSelected);
    if (selectedWorkflows.length === 0) return;
    const request = {
      run_id: selectedWorkflows[0].run_id,
      workflows: selectedWorkflows.map((workflow: WorkflowSolution) => workflow.cwl_name)
    }
    fetch('/ape/cwl_zip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "workflows.zip";
      link.click();
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('There has been a problem with fetching zipped cwl files from the REST APE service:', error);
    });
  }

  const compareSelected = () => {
    runInAction(() => {
      const selectedWorkflows: WorkflowSolution[] = workflowSolutions.filter(
        (workflow: WorkflowSolution) => workflow.isSelected);
      exploreDataStore.selectedWorkflowSolutions = selectedWorkflows;
      navigate('/benchmark/visualize');
    });
  }

  const Rating = (benchmark: TechBenchmarkValue) => 
    <div className="flex gap-4 m-1 items-center">{benchmark.value}
      <div className="rating">
        {benchmark.steps.map((e, i) => 
        [
          <span key={i} className={"tooltip square " + (e.desirability_value === 1 ? "square-filled" : "")} data-tip={e.description}> </span>,
          i + 1 < benchmark.steps.length ? <span className="connect-squares"></span> : null
        ])}
      </div>
    </div>

  const buttonHide = (workflow: WorkflowSolution) => 
    <button className="btn btn-square btn-outline" style={{ position: "absolute", top: 0, left: 0, border: "none" }} onClick={() => { handleSelected(workflow, false) }}>
      <Icon path={mdiEyeOff} size={1} />
    </button>

  const toggleSolutionModal = (workflow: WorkflowSolution) => {
    setModalSolution(workflow);
    const isOpen = !solutionModalOpen
    setSolutionModalOpen(isOpen);
    isOpen ? document.body.classList.add('body-modal-open') : document.body.classList.remove('body-modal-open');
  }

  return (
    <div>
      <ExplorationProgress index={4} />
      <div className="m-20">

        {/* Status messages */}
        { exploreDataStore.isGenerating && <div className="alert alert-info">Generating workflows...</div> }
        { !exploreDataStore.isGenerating && !exploreDataStore.generationError && workflowSolutions.length === 0 && <div className="alert alert-warning"> No solutions were found for given specification. Try a different a specification (e.g., change  maximum workflow length, expected inputs and/or outputs, or remove some constraints). </div> }
        { exploreDataStore.generationError && <div className="alert alert-error">An error occurred while generating the workflows: {exploreDataStore.generationError.toString()}</div> }

        {/* Main content */}
        { !exploreDataStore.isGenerating && !exploreDataStore.generationError && workflowSolutions.length > 0 && 
        (<div className="flex justify-center gap-8">

          {/* List of solutions */}
          <div className="text-left space-y-4 m-8 space-x-1">

            <div className="flex gap-2">
              <input type="checkbox" className="toggle" checked={doShowTechBenchmarks} 
                onChange={event => setShowTechBenchmarks(event.target.checked)} />
              <span>Show benchmarks</span>
            </div>

            <ul>
                <li style={{ borderBottom: "1px solid black" }}>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="h-6 w-6 m-2" defaultChecked={true} 
                      onChange={(event) => { toggleAll(event.target.checked) }}/>
                  </div>
                </li>
              { workflowSolutions.map((workflow: WorkflowSolution, index: number) => (
                <li key={index}>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="h-6 w-6 m-2" checked={workflow.isSelected}
                      onChange={(event) => { handleSelected(workflow, event.target.checked) }}/>
                    <span className="whitespace-nowrap">{ `${workflow.workflow_name} (${workflow.workflow_length})` }</span>
                    <button className="text-blue-500 hover:underline" onClick={() => downloadFile(workflow.run_id, workflow.cwl_name)}>CWL</button>
                  </div>
                </li>
              ))}
            </ul>

            <button className="btn btn-primary" onClick={() => downloadInputFile(workflowSolutions[0].run_id)}>Download <br />CWL input file</button>
            <button className="btn btn-primary" onClick={() => downloadSelectedWorkflows()}>Download selected</button>
            <button className="btn btn-primary" onClick={() => compareSelected()}>Compare<br />selected</button>
          </div>
        
          {/* Cards for selected solutions */}
          <div className="horizontal-scroll-container">
            <div className="horizontal-scroll-content">
              <div className="flex justify-center gap-8">
                  { workflowSolutions.filter((workflow: WorkflowSolution) => workflow.isSelected)
                      .map((workflow: WorkflowSolution, index: number) => (
                        <div key={index} className="flip-card">
                          <div className={`border-2 border-red-200 rounded-xl p-2 shadow-lg flip-card-inner ${doShowTechBenchmarks ? 'is-flipped' : ''}`}>
                            <div className="flip-card-front">
                              {buttonHide(workflow)}
                              <h3>{ workflow.workflow_name }</h3>
                              <button onClick={()=>toggleSolutionModal(workflow)}>
                                { (workflow.image != null) && <img src={workflow.image} alt={workflow.workflow_name} /> }
                                <a type='button' href={workflow.image} download={workflow.workflow_name + ".svg"} className="btn btn-square btn-outline" style={{ position: "absolute", bottom: 0, left: 0, border: "none" }} onClick={(e) => e.stopPropagation()}>
                                  <Icon path={mdiDownload} size={1} />
                                </a>
                              </button>
                            </div>
                            <div className="flip-card-back items-center h-screen">
                              {buttonHide(workflow)}
                              <h3>{ workflow.descriptive_name }</h3>
                              <h4>Technical benchmarks</h4>
                              <hr />
                              <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflowX: "auto" }}>
                                <table>
                                  <tbody>
                                    <tr>
                                      <td style={{ textAlign: 'left' }}>Workflow length</td>
                                      <td style={{ textAlign: 'right' }}><div className="flex gap-4 m-1 items-center">{ workflow.workflow_length }</div></td>
                                    </tr>
                                    {workflow.benchmarkData !== undefined && workflow.benchmarkData.benchmarks.map((benchmark: TechBenchmarkValue) => (
                                      <tr key={benchmark.benchmark_title}>
                                        <td style={{ textAlign: 'left' }} className="tooltip" data-tip={benchmark.benchmark_long_title}>{benchmark.benchmark_title}</td>
                                        <td style={{ textAlign: 'right' }}>{Rating(benchmark)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
      <div id="solutionModal" role="dialog" onClick={()=>toggleSolutionModal(modalSolution)} className={"modal modal-bottom sm:modal-middle" + (solutionModalOpen ? " modal-open" : "")}>
        <div className="modal-box" style={{maxWidth: "unset"}} onClick={(e)=>e.stopPropagation()}>    
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=>toggleSolutionModal(modalSolution)}>✕</button>
          </form>
          <h3 className="font-bold text-lg">{modalSolution?.descriptive_name}</h3>
          <div>
            <img style={{margin: "auto"}} src={modalSolution?.image} alt={modalSolution?.descriptive_name} />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={()=>toggleSolutionModal(modalSolution)}>Close</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

export { GenerationResults };
