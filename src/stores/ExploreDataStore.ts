import { makeAutoObservable } from "mobx";
import { ConstraintInstance, TypeFormatTuple, WorkflowConfig } from "./WorkflowTypes";


const emptyWorkflowConfig = () => {
  return {
    domain: undefined,
    inputs: [ [{id:"",label:""}, {id:"",label:""}] as TypeFormatTuple ],
    outputs: [ [{id:"",label:""}, {id:"",label:""}] as TypeFormatTuple ],
    constraints: [ {constraint: {id:"",label:""}} as ConstraintInstance ],
    minSteps: 1,
    maxSteps: 10,
    timeout: 1000,
    solutionCount: 3
  }
}

export class ExploreDataStore {

  workflowConfig: WorkflowConfig = emptyWorkflowConfig();

  constructor() {
    makeAutoObservable(this);
  }

}

const exploreDataStore = new ExploreDataStore();
export default exploreDataStore;