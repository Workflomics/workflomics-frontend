import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { Link } from 'react-router-dom';
import { ConstraintInstance, WorkflowConfig } from '../../stores/WorkflowTypes';
import { useStore } from '../../store';
import { ConstraintTemplate } from '../../stores/ConstraintStore';
import OntologyTreeSelect from '../OntologyTreeSelect';
import { runInAction } from 'mobx';
import { ApeTaxTuple, TaxonomyClass } from '../../stores/TaxStore';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';

const WorkflowConstraints: React.FC<any> = observer((props) => {
  let { exploreDataStore } = useStore();
  const workflowConfig: WorkflowConfig = exploreDataStore.workflowConfig;
  let { constraintStore } = useStore();
  const allConstraints: ConstraintTemplate[] = constraintStore.availableConstraints.filter(
    (constraint: ConstraintTemplate) => constraint.id === "use_m" || constraint.id === "nuse_m" || constraint.id === "connected_op" || constraint.id === "not_connected_op"
  );
  let { taxStore } = useStore();
  const allToolsTax: ApeTaxTuple = taxStore.availableToolTax;

  React.useEffect(() => {
    if (workflowConfig.domain !== undefined) {
      constraintStore.fetchData(workflowConfig.domain.repo_url);
      taxStore.fetchData(workflowConfig.domain.repo_url);
    }
  }, [constraintStore, taxStore, workflowConfig.domain]);

  const addConstraint = () => {
    runInAction(() => {
      workflowConfig.constraints.push({ id: "", label: "", parameters: [
        taxStore.getEmptyTaxParameter(taxStore.availableToolTax)
      ]});
    });
  };

  const removeConstraint = (index: number) => {
    runInAction(() => {
      workflowConfig.constraints.splice(index, 1);
    });
  };

  const onConstraintTypeChange = (constraintIndex: number, constraintID: string) => {
    runInAction(() => {
      const constraint = allConstraints.find((constraint) => constraint.id === constraintID);
      if (constraint === undefined) {
        return;
      }
      console.log("Constraint type change", constraintIndex, constraint.label);
      const template: ConstraintTemplate = constraint as unknown as ConstraintTemplate;
      const parameters: ApeTaxTuple[] = template.parameters.map((parameter) => {
        //TODO: not only support tools
        return taxStore.getEmptyTaxParameter(taxStore.availableToolTax);
      });
      workflowConfig.constraints[constraintIndex] = { id: template.id, label: template.label, parameters: parameters };
    });
  };

  const onParameterChange = (constraintIndex: number, parameterIndex: number, value: TaxonomyClass | null, root: string) => {
    if (value === null) {
      return;
    }
    runInAction(() => {
      console.log("Parameter change", constraintIndex, value.label, root);
      const constraintInstance: ConstraintInstance = workflowConfig.constraints[constraintIndex];
      constraintInstance.parameters[parameterIndex][root] = value;
    });
  };

  return (
    <div>

      <ExplorationProgress index={2} />

      <div className="m-8">
        <div className="text-left space-y-6 mt-10">

          {/* Status messages */}
          {constraintStore.isLoading && <div className="alert alert-info">Loading constraints...</div>}
          {taxStore.isLoading && <div className="alert alert-info">Loading tools...</div>}
          {workflowConfig.domain === undefined && <div className="alert alert-error">Domain could not be retrieved</div>}
          {constraintStore.error && <div className="alert alert-error">Constraints could not be retrieved ({constraintStore.error})</div>}
          {taxStore.error && <div className="alert alert-error">Tools could not be retrieved ({taxStore.error})</div>}

          {/* Constraints */}
          { !constraintStore.isLoading && !taxStore.isLoading && !constraintStore.error && !taxStore.error && 
            constraintStore.availableConstraints.length > 0 && Object.entries(allToolsTax).length > 0 &&
            <div className="flex items-center space-x-4">
              <div className="tooltip tooltip-right" data-tip="Provide information about data formats, types and operations to guide the workflow generation.">
                <span className="text-3xl flex-grow-0 w-40">Constraints</span>
              </div>
              <div className="flex flex-grow flex-row space-x-4">
                {
                  workflowConfig.constraints.map((constraint: ConstraintInstance, constraintIndex: number) => {
                    const root = "http://edamontology.org/operation_0004";
                    return (<div key={constraintIndex}
                                className="remove-button-container flex flex-col space-y-2 relative">
                      <button
                        className="remove-button btn btn-square btn-outline btn-sm"
                        style={{ position: "absolute", top: "-4px", right: "-10px", zIndex: 10, border: "none"}}
                        onClick={() => { removeConstraint(constraintIndex); }} >
                          <Icon path={mdiClose} size={1} />
                      </button>
                      <select className="select select-bordered w-full max-w-xs"
                              style={{ fontWeight: 'bold' }}
                              value={constraint.id}
                              onChange={(e) => onConstraintTypeChange(constraintIndex, e.target.value)}>
                        <option disabled value="">Select the constraint type</option>
                        {allConstraints.map((constraint: ConstraintTemplate) => {
                          return (
                            <option 
                              key={constraint.id}
                              value={constraint.id}>{constraint.label}</option>
                          );
                        })}
                      </select>

                      { constraint.id !== "" && constraint.parameters.map((parameter: ApeTaxTuple, parameterIndex: number) => {
                          return (<OntologyTreeSelect
                            key={parameterIndex}
                            ontology={allToolsTax[root]}
                            value={parameter[root]}
                            setValue={(value: TaxonomyClass | null) => onParameterChange(constraintIndex, parameterIndex, value, root)}
                            placeholder="Operation" />);
                      })}

                    </div>);
                  })
                }
                {/* "Add constraint" button */}
                <div className="tooltip tooltip-bottom" data-tip="Add an additional constraint to the specification.">
                  <button className="btn m-1 w-12 h-12 text-lg mt-6" onClick={() => addConstraint()}>+</button>
                </div>
              </div >
            </div >
          }

          {/* Prev/next buttons */}
          < div className="flex justify-between p-10" >
          <div className="tooltip tooltip-right" data-tip="Go to the previous step.">
              <Link to="/explore/inputs-outputs"><button className="btn btn-primary">Previous</button></Link>
              </div>
              <div className="tooltip tooltip-left" data-tip="Go to the next step.">
              <Link to="/explore/configuration"><button className="btn btn-primary">Next</button></Link>
              </div>
          </div >

        </div >
      </div >
    </div >
  );
});

export { WorkflowConstraints };
