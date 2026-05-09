import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task, TaskStatus } from './tasks.models';
import { CreateTaskDTO } from './DTO/tasks.createTaskDTO';
import { SearchTaskDTO } from './DTO/task.searchTaskDTO';
import { IsStatusValid } from './Pipes/IsStatusValid.pipe';
import { IsValidSearchTerm } from './Pipes/isValidSearchTerm.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private taskService : TasksService){
        
    }
    @Get()
    getTasks(@Query(ValidationPipe) searchTaskDTO : SearchTaskDTO) : Task[]{
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
    @UsePipes(ValidationPipe)
    createTask(@Body() taskDTO : CreateTaskDTO) : Task{
        return this.taskService.createTask(taskDTO);
    }
    @Delete('/:id')
    deleteTask(@Param('id') id : string){
        this.taskService.deleteTask(id);
    }
    @Patch("/:id/status")
    updateTaskStatus(@Param('id') id : string, @Body('status', IsStatusValid) status : TaskStatus) : void {
        this.taskService.updateTaskStatus(id, status);
    }
    
}
