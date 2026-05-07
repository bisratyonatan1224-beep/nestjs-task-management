import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.models';
import { CreateTaskDTO } from './DTO/tasks.createTaskDTO';


@Injectable()
export class TasksService {
    private tasks : Task[]= [];

    getAllTasks() : Task[]{
        return this.tasks;
    }
    createTask(taskDTO : CreateTaskDTO) : Task {
        const {title, description} = taskDTO;
        const task = {
            id: crypto.randomUUID(),
            title,
            description,
            status : TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }
    getTask(id: string)  {
        for(const task of this.tasks){
            if(task.id === id) {
                return task
            }
            else {
                console.log("Nothing by that id")
            }
        }
    }
}
