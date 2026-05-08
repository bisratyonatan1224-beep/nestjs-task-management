import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './tasks.models';
import { CreateTaskDTO } from './DTO/tasks.createTaskDTO';
import { TaskStatus } from './tasks.models';
import { SearchTaskDTO } from './DTO/task.searchTaskDTO';
import { title } from 'process';

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
    getTask(id: string): Task {
        const task = this.tasks.find(task => task.id === id);

        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }

        return task;
    }
    filterTask(searchTaskDTO : SearchTaskDTO) {
        let tasks = this.getAllTasks();
        if(searchTaskDTO.status){
            tasks = tasks.filter(task=> task.status===searchTaskDTO.status);
        }
        if(searchTaskDTO.title){
            tasks = tasks.filter(task=> task.title.includes(searchTaskDTO.title) || task.description.includes(searchTaskDTO.title));
        }
        return tasks;
    }
    deleteTask(id:string) : void {
        const task = this.tasks.filter(task => task.id !==id);
        this.tasks = task;
    }
    updateTaskStatus(id:string, status : TaskStatus) : void {
        const task = this.tasks.find(task => task.id === id);
        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        task.status = status;
    }
    
}
