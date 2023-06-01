import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { Link } from 'react-router-dom';
import { ConstraintInstance, WorkflowConfig } from '../../stores/WorkflowTypes';
import { useStore } from '../../store';
import { Constraint } from '../../stores/ConstraintStore';
import { TreeNode, TreeSelectionBox } from '../TreeSelectionBox';

const WorkflowConstraints: React.FC<any> = observer((props) => {
  let { exploreDataStore } = useStore();
  const workflowConfig: WorkflowConfig = exploreDataStore.workflowConfig;
  let { constraintStore } = useStore();
  const allConstraints: Constraint[] = constraintStore.availableConstraints;

  const onConstraintTypeChange = (node: TreeNode) => {
    console.log(node);
  };

  const addConstraint = () => {
    workflowConfig.constraints.push({constraint: {id:"",label:"",parameters:[]}});
  };

  return (
    <div>

      <ExplorationProgress index={2} />

      <div className="m-8">
        <div className="overflow-x-auto text-left space-y-6 mt-10">

          {/* Status messages */}
          { constraintStore.isLoading && <div className="alert alert-info">Loading constraints...</div> }
          { workflowConfig.domain === undefined && <div className="alert alert-error">Domain could not be retrieved</div> }
          { constraintStore.error && <div className="alert alert-error">Constraints could not be retrieved ({constraintStore.error})</div> }

          {/* Constraints */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl flex-grow-0 w-32">Constraints</span>
            <div className="flex flex-grow items-center">
              { workflowConfig.constraints.map((constraint: ConstraintInstance, index:number) => {
                  return (<TreeSelectionBox key={index} value={constraint.constraint} 
                    nodes={allConstraints} onChange={(node: TreeNode) => onConstraintTypeChange(node)}
                    placeholder="Type of constraint" />)
                })}
              <button className="btn" onClick={() => addConstraint()}>+</button>
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
