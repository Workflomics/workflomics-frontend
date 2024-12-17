import * as React from "react";
import { observer } from "mobx-react-lite";
import { ExplorationProgress } from "./ExplorationProgress";
import { useStore } from "../../store";
import { WorkflowSolution } from "../../stores/WorkflowTypes";
import { runInAction } from "mobx";
import { useNavigate } from "react-router-dom";
import { WorkflowCard } from "./WorkflowCard";
import "./GenerationResults.css";

const GenerationResults: React.FC<any> = observer((props) => {
  const navigate = useNavigate();
  const { exploreDataStore } = useStore();
  const workflowSolutions = exploreDataStore.workflowSolutions;
  const [doShowTechBenchmarks, setShowTechBenchmarks] = React.useState(false);
  const [solutionModalOpen, setSolutionModalOpen] = React.useState(false);
  const [modalSolution, setModalSolution] = React.useState(
    workflowSolutions[0]
  );

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
      workflowSolutions.map((solution, _) => handleSelected(solution, checked));
    });
  };

  const downloadFile = (run_id: string, cwl_name: string) => {
    const request = {
      run_id: run_id,
      file_name: cwl_name,
    };
    fetch("/ape/cwl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((response) => response.text())
      .then((data) => {
        const blob = new Blob([data], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = cwl_name;
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with accessing a cwl file from the REST APE service:",
          error
        );
      });
  };

  const downloadInputFile = (run_id: string) => {
    fetch(`/ape/cwl_input?run_id=${run_id}`)
      .then((response) => response.text())
      .then((data) => {
        const blob = new Blob([data], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "input.yml";
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with accessing cwl input file from the REST APE service:",
          error
        );
      });
  };

  const downloadSelectedWorkflows = () => {
    const selectedWorkflows: WorkflowSolution[] = workflowSolutions.filter(
      (workflow: WorkflowSolution) => workflow.isSelected
    );
    if (selectedWorkflows.length === 0) return;
    const request = {
      run_id: selectedWorkflows[0].run_id,
      workflows: selectedWorkflows.map(
        (workflow: WorkflowSolution) => workflow.cwl_name
      ),
    };
    fetch("/ape/cwl_zip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "workflows.zip";
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with fetching zipped cwl files from the REST APE service:",
          error
        );
      });
  };

  const compareSelected = () => {
    runInAction(() => {
      const selectedWorkflows: WorkflowSolution[] = workflowSolutions.filter(
        (workflow: WorkflowSolution) => workflow.isSelected
      );
      exploreDataStore.selectedWorkflowSolutions = selectedWorkflows;
      navigate("/benchmark/visualize");
    });
  };

  const toggleSolutionModal = (workflow: WorkflowSolution) => {
    setModalSolution(workflow);
    const isOpen = !solutionModalOpen;
    setSolutionModalOpen(isOpen);
    isOpen
      ? document.body.classList.add("body-modal-open")
      : document.body.classList.remove("body-modal-open");
  };

  return (
    <div>
      <ExplorationProgress index={4} />
      <div className="m-20">
        {/* Status messages */}
        {exploreDataStore.isGenerating && (
          <div className="alert alert-info">Generating workflows...</div>
        )}
        {!exploreDataStore.isGenerating &&
          !exploreDataStore.generationError &&
          workflowSolutions.length === 0 && (
            <div className="alert alert-warning">
              {" "}
              No solutions were found for given specification. Try a different a
              specification (e.g., change maximum workflow length, expected
              inputs and/or outputs, or remove some constraints).{" "}
            </div>
          )}
        {exploreDataStore.generationError && (
          <div className="alert alert-error">
            An error occurred while generating the workflows:{" "}
            {exploreDataStore.generationError.toString()}
          </div>
        )}

        {/* Main content */}
        {!exploreDataStore.isGenerating &&
          !exploreDataStore.generationError &&
          workflowSolutions.length > 0 && (
            <div className="gap-8">
              <div className="flex justify-center gap-8">
                {/* List of solutions */}
                <div className="text-left space-y-4 space-x-1" style={{width: '35vw'}}>
                  <div className="flex gap-2">
                    <span>
                      <b>Figures</b>
                    </span>
                    <input
                      type="checkbox"
                      className="toggle custom-toggle"
                      checked={doShowTechBenchmarks}
                      onChange={(event) =>
                        setShowTechBenchmarks(event.target.checked)
                      }
                    />
                    <span>
                      <b>Benchmarks</b>
                    </span>
                  </div>
                  <div className=" justify-center gap-8  overflow-auto" style={{height: '450px'}}>
                  <ul>
                    <li style={{ borderBottom: "1px solid black" }}>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="h-6 w-6 m-2"
                          defaultChecked={true}
                          onChange={(event) => {
                            toggleAll(event.target.checked);
                          }}
                        />
                        <span className="whitespace-nowrap"> Select all</span>
                      </div>
                  </li>
                    {workflowSolutions.map(
                      (workflow: WorkflowSolution, index: number) => (
                        <li key={index}>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="h-6 w-6 m-2"
                              checked={workflow.isSelected}
                              onChange={(event) => {
                                handleSelected(
                                  workflow,
                                  event.target.checked
                                );
                              }}
                            />
                            <span className="whitespace-nowrap">{`${workflow.workflow_name} | Steps: ${workflow.workflow_length} | `}</span>
                            <button
                              className="text-blue-500 hover:underline"
                              onClick={() =>
                                downloadFile(
                                  workflow.run_id,
                                  workflow.cwl_name
                                )
                              }
                            >
                              CWL
                            </button>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                  </div>
                </div>

                {/* Cards for selected solutions */}
                <div className="horizontal-scroll-container">
                  <div className="horizontal-scroll-content">
                    <div className="flex justify-center gap-8">
                      {workflowSolutions
                        .filter(
                          (workflow: WorkflowSolution) => workflow.isSelected
                        )
                        .map((workflow: WorkflowSolution, index: number) => (
                            <WorkflowCard key={index} 
                                workflow={workflow}
                                handleSelected={handleSelected}
                                doShowTechBenchmarks={doShowTechBenchmarks}
                                toggleSolutionModal={toggleSolutionModal} />
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-2 mt-8">
                <div className="flex justify-left gap-2">
                  <div
                    className="tooltip tooltip-right"
                    data-tip="Download a zip file containing the selected CWLs and instructions how to run them."
                  >
                    <button
                      className="btn btn-primary"
                      onClick={() => downloadSelectedWorkflows()}
                    >
                      Download <br /> selected
                    </button>
                  </div>
                  <div
                    className="tooltip tooltip-right"
                    data-tip="Download the CWL input file."
                  >
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        downloadInputFile(workflowSolutions[0].run_id)
                      }
                    >
                      Download <br />
                      CWL input file
                    </button>
                  </div>
                </div>
                <div
                  className="tooltip tooltip-left"
                  data-tip="Go to the page to upload the run-time benchmarks."
                >
                  <button
                    className="btn btn-primary"
                    onClick={() => compareSelected()}
                  >
                    Upload benchmarked
                    <br /> workflows
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
      <div
        id="solutionModal"
        role="dialog"
        onClick={() => toggleSolutionModal(modalSolution)}
        className={
          "modal modal-bottom sm:modal-middle" +
          (solutionModalOpen ? " modal-open" : "")
        }
      >
        <div
          className="modal-box"
          style={{ maxWidth: "unset" }}
          onClick={(e) => e.stopPropagation()}
        >
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => toggleSolutionModal(modalSolution)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            {modalSolution?.descriptive_name}
          </h3>
          <div>
            <img
              style={{ margin: "auto" }}
              src={modalSolution?.image}
              alt={modalSolution?.descriptive_name}
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn"
                onClick={() => toggleSolutionModal(modalSolution)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

export { GenerationResults };
