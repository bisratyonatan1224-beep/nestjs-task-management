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
import { User } from 'src/auth/auth.entity';
import { ReturnTaskDTO } from './DTO/returnTask.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>
    ) {}

    async getTasks(filterDTO : SearchTaskDTO, user : User) : Promise<Task[]> {
       const query = this.taskRepository.createQueryBuilder('task');
       query.where('task.userId= :userId', {userId : user.id}) 
       const {title, status} = filterDTO;

       if(filterDTO.status){
        query.andWhere('task.status = :status AND task.userId = :userId', {status});
       }
       if(filterDTO.title){
        query.andWhere('(task.title LIKE :title OR task.description LIKE :title)', {title : `%${title}%`})
       }
        const tasks = await query.getMany();
        return tasks;
    }
    // async getAllTasks() : Promise<Task[]>{
    //     const tasks : Task[] = await this.taskRepository.find();
    //     return tasks; 
    // }
    
    async createTask(
        taskDTO : CreateTaskDTO,
        user : User
    ) : Promise<ReturnTaskDTO> {
            const task = new Task();
            const returnTaskDTO = new ReturnTaskDTO()
            task.title = taskDTO.title;
            task.description = taskDTO.description
            task.status = TaskStatus.OPEN;
            task.user = user;
            await task.save();
            returnTaskDTO.title = task.title;
            returnTaskDTO.description = task.description;
            returnTaskDTO.status = task.status;
            returnTaskDTO.id = task.id;
           
            return returnTaskDTO;
    }

    
    async getTaskById(id : number, user : User) : Promise<Task>{
        const task = await this.taskRepository.findOne({where: {id, userId: user.id}});

        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }

        return task;
    }
   
    // async filterTask (searchDTO : SearchTaskDTO) : Promise<Task[]> {
    //     let tasks = await this.getAllTasks();
    //         if(searchDTO.status){
    //             tasks = tasks.filter(task=> task.status===searchDTO.status);
    //         }
    //         if(searchDTO.title){
    //             tasks = tasks.filter(task=> task.title.includes(searchDTO.title) || task.description.includes(searchDTO.title));
    //         }
    //     return tasks;
    // }
    
    async deleteTask(id : number, user : User): Promise<Task>{
        const task = await this.taskRepository.findOne({where: {id, userId: user.id}});
        if(task){
            await this.taskRepository.delete(id);
            return task
        }
        else{
            throw new NotFoundException(`Task with id ${id} not found`);
        }
    }

    async updateTaskStatus(id:number, status: TaskStatus, user : User) : Promise<Task> {
        const task = await this.taskRepository.findOne({where: {id, userId: user.id}});
        if(task ){
            task.status = status;
            await task.save();
        }
        
        if(!task) {
            throw new BadRequestException(`${id} is invalid`)
        }
        return task;
    }
   
    
}
