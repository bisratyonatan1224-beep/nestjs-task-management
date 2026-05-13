import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { TaskStatus } from './taskStatus.enum';
import { CreateTaskDTO } from './DTO/tasks.createTaskDTO';
import { SearchTaskDTO } from './DTO/task.searchTaskDTO';
import { IsStatusValid } from './Pipes/IsStatusValid.pipe';
import { Task } from './tasks.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
    constructor(private taskService : TasksService){
        
     }
    @Get()
    getTasks(@Query(ValidationPipe) searchTaskDTO : SearchTaskDTO) : Promise<Task[]>{
        return this.taskService.getTasks(searchTaskDTO);
    }
   
    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id : number) : Promise<Task> {
        return this.taskService.getTaskById(id);
    }
    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() taskDTO : CreateTaskDTO) : Promise<Task>{
        return this.taskService.createTask(taskDTO);
    }
    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id : number){
        this.taskService.deleteTask(id);
    }
    @Patch("/:id/status")
    updateTaskStatus(@Param('id', ParseIntPipe) id : number, @Body('status', IsStatusValid) status : TaskStatus) : void {
        this.taskService.updateTaskStatus(id, status);
    }
    
     
}