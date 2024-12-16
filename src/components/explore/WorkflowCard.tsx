import React from "react";
import { observer } from "mobx-react-lite";
import { WorkflowBenchmark } from "../../stores/BenchmarkTypes";
import { WorkflowSolution } from "../../stores/WorkflowTypes";
import { mdiDownload, mdiEyeOff } from "@mdi/js";
import Icon from "@mdi/react";
import { mapDesirabilityToColor, mapValueToBackground } from "../../utils";


interface WorkflowCardProps {
  workflow: WorkflowSolution;
  doShowTechBenchmarks: boolean;
  handleSelected: (workflow: WorkflowSolution, isSelected: boolean) => void;
  toggleSolutionModal: (workflow: WorkflowSolution) => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = observer((props) => {
  const { workflow, doShowTechBenchmarks, handleSelected, toggleSolutionModal } = props;


  const buttonHide = (workflow: WorkflowSolution) => (
    <button
      className="btn btn-square btn-outline"
      style={{ position: "absolute", top: 0, left: 0, border: "none" }}
      onClick={() => {
        handleSelected(workflow, false);
      }}
    >
      <Icon path={mdiEyeOff} size={1} />
    </button>
  );

  const Rating = (benchmark: WorkflowBenchmark) => (
    <div className="flex gap-4 m-1 items-center">
      <div className="rating">
        {benchmark.steps.map((step, i) => [
          <span
            key={i}
            className={"tooltip square"}
            data-tip={step.label}
            style={{
              backgroundColor: mapDesirabilityToColor(step.desirability),
              backgroundImage: mapValueToBackground(step.label),
            }}
          >
            {" "}
          </span>,
          i + 1 < benchmark.steps.length ? (
            <span className="connect-squares"></span>
          ) : null,
        ])}
      </div>
    </div>
  );

  return (
    <div className="flip-card">
    <div
      className={`border-2 border-red-200 rounded-xl p-2 shadow-lg flip-card-inner ${
        doShowTechBenchmarks ? "is-flipped" : ""
      }`}
    >
      <div className="flip-card-front">
        {buttonHide(workflow)}
        <h3>{workflow.workflow_name}</h3>
        <br />
        <h4>
          <b>Workflow structure</b>
        </h4>
        <button
          onClick={() => toggleSolutionModal(workflow)}
        >
          {workflow.image != null && (
            <img
              src={workflow.image}
              alt={workflow.workflow_name}
            />
          )}
          <a
            type="button"
            href={workflow.image}
            download={workflow.workflow_name + ".svg"}
            className="btn btn-square btn-outline"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              border: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon path={mdiDownload} size={1} />
          </a>
        </button>
      </div>
      <div className="flip-card-back items-center h-screen">
        {buttonHide(workflow)}
        <h3>{workflow.workflow_name}</h3>
        <br />
        <h4>
          <b>Design-time benchmarks</b>
        </h4>
        <hr />
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflowX: "auto",
          }}
        >
          <table>
            <tbody>
              <tr>
                <td className="tooltip">
                  Workflow length
                </td>
                <td>{workflow?.workflow_length}</td>
                <td></td>
              </tr>
              {workflow?.benchmarkData?.benchmarks.map(
                (benchmark: WorkflowBenchmark) => (
                  <tr key={benchmark.title}>
                    <td
                      className="tooltip tooltip-right"
                      data-tip={benchmark.description}
                    >
                      {benchmark.title}
                    </td>
                    <td>
                      {benchmark.aggregate_value.value}
                    </td>
                    <td>{Rating(benchmark)}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  )
});

export { WorkflowCard };
