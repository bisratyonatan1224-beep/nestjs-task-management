import { TaskStatus } from "../tasks.models";

export class SearchTaskDTO {
    title : string;
    status : TaskStatus;
}