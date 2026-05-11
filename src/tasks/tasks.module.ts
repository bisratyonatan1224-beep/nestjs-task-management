import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeORMError } from 'typeorm/browser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController], //d
  providers: [TasksService]
})
export class TasksModule {}