import { TaskStatus } from "src/tasks/taskStatus.enum";

export class ReturnTaskDTO {
    title : string;
    description : string;
    status : TaskStatus
    id: number
}