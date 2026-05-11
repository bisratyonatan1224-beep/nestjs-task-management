import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { SearchTaskDTO } from "../DTO/task.searchTaskDTO";
import { TaskStatus } from "../taskStatus.enum";

export class IsValidSearchTerm implements PipeTransform {
    transform(searchTask: SearchTaskDTO, metadata: ArgumentMetadata) {
        const isTitle : Boolean = Boolean(searchTask.title);
        const isStatus : Boolean = Object.values(TaskStatus).includes(searchTask.status);
        if(isTitle || isStatus){
            return searchTask
        }
        throw new BadRequestException(`${searchTask.title} is an invalid title and ${searchTask.status} is an invalid status`);
    }
    
}