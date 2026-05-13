import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../taskStatus.enum";

export class SearchTaskDTO {
    @IsOptional()
    @IsNotEmpty()
    title : string;
    @IsOptional()
    @IsIn(Object.values(TaskStatus))
    status : TaskStatus;

    
}