import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { TaskStatus } from './taskStatus.enum';
import { CreateTaskDTO } from './DTO/tasks.createTaskDTO';
import { SearchTaskDTO } from './DTO/task.searchTaskDTO';
import { IsStatusValid } from './Pipes/IsStatusValid.pipe';
import { Task } from './tasks.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/auth.entity';
import { GetUser } from 'src/auth/getUser.decorator';
import { ReturnTaskDTO } from './DTO/returnTask.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
    private logger = new Logger("TaskController");
    constructor(private taskService : TasksService){
        
     }
    @Get()
    async getTasks(
        @Query(ValidationPipe) searchTaskDTO : SearchTaskDTO,
        @GetUser() user : User
    ) : Promise<Task[]>{
        this.logger.verbose(`User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(searchTaskDTO)}  `)
        return this.taskService.getTasks(searchTaskDTO, user);
    }
   
    @Get('/:id')
    async getTaskById(
        @Param('id', ParseIntPipe) id : number,
        @GetUser() user : User
    ) : Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }
    @Post()
    @UsePipes(ValidationPipe)
    async createTask(
        @Body() taskDTO : CreateTaskDTO,
        @GetUser() user : User
    ) : Promise<ReturnTaskDTO>{
        return this.taskService.createTask(taskDTO, user);
    }
    @Delete('/:id')
    async deleteTask(@Param('id', ParseIntPipe) id : number, @GetUser() user : User){
        this.taskService.deleteTask(id, user);
    }
    @Patch("/:id/status")
    async updateTaskStatus(
        @Param('id', ParseIntPipe) id : number, 
        @Body('status', IsStatusValid) status : TaskStatus, 
        @GetUser() user : User) : Promise<Task> {

        return this.taskService.updateTaskStatus(id, status, user);
    }
    
     
}