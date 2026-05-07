import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.models';


@Injectable()
export class TasksService {
    private tasks : Task[]= [];

    getAllTasks() : Task[]{
        return this.tasks;
    }
    createTask(title : string, description : string) : Task {
        const task : Task = {
            id: crypto.randomUUID(),
            title : title, 
            description : description, 
            status : TaskStatus.OPEN
        } 
        this.tasks.push(task);
        return task;
    }
}
