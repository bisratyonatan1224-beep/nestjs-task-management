import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task, TaskStatus } from './tasks.models';
import { CreateTaskDTO } from './DTO/tasks.createTaskDTO';
import { SearchTaskDTO } from './DTO/task.searchTaskDTO';

@Controller('tasks')
export class TasksController {
    constructor(private taskService : TasksService){
        
    }
    @Get()
    getTasks(@Query() searchTaskDTO : SearchTaskDTO) : Task[]{
        if(Object.keys(searchTaskDTO).length){
            return this.taskService.filterTask(searchTaskDTO);
        } else
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
