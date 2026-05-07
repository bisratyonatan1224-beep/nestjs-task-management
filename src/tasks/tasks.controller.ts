import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task, TaskStatus } from './tasks.models';
import { CreateTaskDTO } from './DTO/tasks.createTaskDTO';

@Controller('tasks')
export class TasksController {
    constructor(private taskService : TasksService){
        
    }
    @Get()
    getAllTasks() : Task[]{
        return this.taskService.getAllTasks()
    }
    @Get('/:id')
    getTask(@Param('id') id : string) {
        return this.taskService.getTask(id);
    }
    @Post()
    createTask(@Body() taskDTO : CreateTaskDTO) : Task{
        return this.taskService.createTask(taskDTO);
    }
    @Delete('/:id')
    deleteTask(@Param('id') id : string){
        this.taskService.deleteTask(id);
    }
    @Patch("/:id/status")
    updateTaskStatus(@Param('id') id : string, @Body('status') status : TaskStatus) : void {
        this.taskService.updateTaskStatus(id, status);
    }
}
