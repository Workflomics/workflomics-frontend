import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { Link } from 'react-router-dom';
import { WorkflowConfig } from '../../stores/WorkflowTypes';
import { useStore } from '../../store';
import { Constraint, ConstraintInstance } from '../../stores/ConstraintStore';
import { TreeNode, TreeSelectionBox } from '../TreeSelectionBox';
import { ToolTax } from '../../stores/ToolTaxStore';
import { runInAction } from 'mobx';

const WorkflowConstraints: React.FC<any> = observer((props) => {
  let { exploreDataStore } = useStore();
  const workflowConfig: WorkflowConfig = exploreDataStore.workflowConfig;
  let { constraintStore } = useStore();
  const allConstraints: Constraint[] = constraintStore.availableConstraints.filter(
    (constraint: Constraint) => constraint.id === "use_m" || constraint.id === "nuse_m"
  );
  let { toolTaxStore } = useStore();
  const allTools: ToolTax[] = toolTaxStore.availableToolTax;

  React.useEffect(() => {
    if (workflowConfig.domain !== undefined) {
      constraintStore.fetchData(workflowConfig.domain.repo_url);
      toolTaxStore.fetchData(workflowConfig.domain.repo_url);
    }
  }, [constraintStore, toolTaxStore, workflowConfig.domain]);

  const addConstraint = () => {
    runInAction(() => {
      workflowConfig.constraints.push({
        constraint: {id: "", label: "", parameters: []},
        parameters: []
      });
    });
  };

  const removeConstraint = () => {
    runInAction(() => {
      workflowConfig.constraints.pop();
    });
  };

  const onConstraintTypeChange = (constraintIndex: number, node: TreeNode) => {
    runInAction(() => {
      workflowConfig.constraints[constraintIndex] = {
        constraint: {id: node.id, label: node.label, parameters:[{id:"",label:""}]},
        parameters: [{id:"",label:""}]
      };
    });
  };

  const onParameterChange = (constraintIndex: number, node: TreeNode) => {
    runInAction(() => {
      const constraintInstance = workflowConfig.constraints[constraintIndex];
      constraintInstance.parameters[0] = { id: node.id, label: node.label };
    });
  };

  return (
    <div>

      <ExplorationProgress index={2} />

      <div className="m-8">
        <div className="text-left space-y-6 mt-10">

          {/* Status messages */}
          { constraintStore.isLoading && <div className="alert alert-info">Loading constraints...</div> }
          { workflowConfig.domain === undefined && <div className="alert alert-error">Domain could not be retrieved</div> }
          { constraintStore.error && <div className="alert alert-error">Constraints could not be retrieved ({constraintStore.error})</div> }

          {/* Constraints */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-40">Constraints</span>
            <div className="flex flex-grow items-center">
              { workflowConfig.constraints.map((constraint: ConstraintInstance, index:number) => {
                  return (<div key={index}>
                      <TreeSelectionBox value={constraint.constraint} 
                        nodes={allConstraints} onChange={(node: TreeNode) => onConstraintTypeChange(index, node)}
                        placeholder="Type of constraint" />
                      { constraint.constraint.id !== "" && <TreeSelectionBox value={constraint.parameters.length > 0 ? constraint.parameters[0] : ""}
                        nodes={allTools} onChange={(node: TreeNode) => onParameterChange(index, node)}
                        placeholder="Operation" /> }
                      </div>);
                })}
              <button className="btn m-1 w-12 h-12 text-lg" onClick={() => addConstraint()}>+</button>
              <button className="btn m-1 w-12 h-12 text-lg" onClick={() => removeConstraint()}>-</button>
            </div>
          </div>

          {/* Prev/next buttons */}
          <div className="flex justify-between p-10">
            <Link to="/explore/inputs-outputs"><button className="btn btn-primary">Previous</button></Link>
            <Link to="/explore/configuration"><button className="btn btn-primary">Next</button></Link>
          </div>

        </div>
      </div>
    </div>
  );
});

export { WorkflowConstraints };
