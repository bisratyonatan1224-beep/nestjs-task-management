import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './DTO/tasks.createTaskDTO';
import { TaskStatus } from './taskStatus.enum';
import { SearchTaskDTO } from './DTO/task.searchTaskDTO';
import { title } from 'process';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';
import { response } from 'express';
import { stat } from 'fs';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
    ) {}

    async getTasks(filterDTO : SearchTaskDTO) : Promise<Task[]> {
       const query = this.taskRepository.createQueryBuilder('task');
       const {title, status} = filterDTO
       if(filterDTO.status){
        query.andWhere('task.status = :status', {status});
       }
       if(filterDTO.title){
        query.andWhere('(task.title LIKE :title OR task.description LIKE :title)', {title : `%${title}%`})
       }
        const tasks = query.getMany();
        return tasks;
    }
    async getAllTasks() : Promise<Task[]>{
        const tasks : Task[] = await this.taskRepository.find();
        return tasks; 
    }
    
    async createTask(taskDTO : CreateTaskDTO) : Promise<Task> {
            const task = new Task();
            task.title = taskDTO.title;
            task.description = taskDTO.description
            task.status = TaskStatus.OPEN;
            await task.save();
            return task;
    }

    
    async getTaskById(id : number) : Promise<Task>{
        const task = await this.taskRepository.findOne({where: {id}});

        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }

        return task;
    }
   
    async filterTask (searchDTO : SearchTaskDTO) : Promise<Task[]> {
        let tasks = await this.getAllTasks();
            if(searchDTO.status){
                tasks = tasks.filter(task=> task.status===searchDTO.status);
            }
            if(searchDTO.title){
                tasks = tasks.filter(task=> task.title.includes(searchDTO.title) || task.description.includes(searchDTO.title));
            }
        return tasks;
    }
    
    async deleteTask(id : number): Promise<Task>{
        const task = await this.taskRepository.findOne({where: {id}});
        if(task){
            this.taskRepository.delete(id);
            return task
        }
        else{
            throw new NotFoundException(`Task with id ${id} not found`);
        }
    }

    async updateTaskStatus(id:number, status: TaskStatus) : Promise<Task> {
        const task = await this.taskRepository.findOne({where: {id}});
        if(task ){
            task.status = status;
            task.save();
        }
        
        if(!task) {
            throw new BadRequestException(`${id} is invalid`)
        }
        return task;
    }
   
    
}
