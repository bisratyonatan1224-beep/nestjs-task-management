import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task } from './tasks.models';
import { CreateTaskDTO } from './DTO/tasks.createTaskDTO';

@Controller('tasks')
export class TasksController {
    constructor(private taskService : TasksService){
        
    }
    @Get()
    getAllTasks() : Task[]{
        return this.taskService.getAllTasks()
    }

    @Post()
    createTask(@Body() taskDTO : CreateTaskDTO) : Task{
        return this.taskService.createTask(taskDTO);
    }
}
