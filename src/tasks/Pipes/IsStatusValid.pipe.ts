import { ArgumentMetadata, BadRequestException, NotFoundException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../tasks.models";
 
export class IsStatusValid implements PipeTransform {
    transform(status: TaskStatus, metadata: ArgumentMetadata) {
        if(Object.values(TaskStatus).includes(status)){
            return status;
        }
        throw new BadRequestException(`Status ${status} in invalid`);
    }

}