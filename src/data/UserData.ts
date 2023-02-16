import { makeAutoObservable, runInAction } from "mobx";
import { Workflow } from "./WorkflowData";

export default class UserData {

  workflows: Workflow[] = [];

}

