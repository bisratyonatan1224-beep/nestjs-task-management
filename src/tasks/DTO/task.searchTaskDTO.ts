import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../tasks.models";

export class SearchTaskDTO {
    @IsOptional()
    @IsNotEmpty()
    title : string;
    @IsOptional()
    @IsIn(Object.values(TaskStatus))
    status : TaskStatus;
}