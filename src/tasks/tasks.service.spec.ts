import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { TaskStatus } from './taskStatus.enum';

const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
};

const mockTaskRepository = () => ({
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    findOne: jest.fn(),
    delete: jest.fn(),
});

const saveMock = jest.fn().mockImplementation(function (this: any) {
    this.id = 1;
    return Promise.resolve(this);
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: getRepositoryToken(Task),
                    useFactory: mockTaskRepository,
                },
            ],
        }).compile();

        tasksService = module.get<TasksService>(TasksService);
        taskRepository = module.get(getRepositoryToken(Task));

        jest.clearAllMocks();
    });

    describe('getTasks', () => {
        it('gets title and status filtered tasks from the repository', async () => {
            const mockTasks = [
                {
                    id: 1,
                    title: 'Title',
                    status: 'OPEN',
                },
            ];

            const filterDTO = {
                title: 'Title',
                status: 'OPEN',
            };

            const user = {
                id: 1,
            };

            mockQueryBuilder.getMany.mockResolvedValue(mockTasks);

            const result = await tasksService.getTasks(filterDTO, user);

            expect(taskRepository.createQueryBuilder).toHaveBeenCalledWith('task');

            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                'task.userId= :userId',
                { userId: 1 },
            );

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                'task.status = :status',
                { status: filterDTO.status },
            );

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                '(task.title LIKE :title OR task.description LIKE :title)',
                { title: `%${filterDTO.title}%` },
            );

            expect(mockQueryBuilder.getMany).toHaveBeenCalled();

            expect(result).toEqual(mockTasks);
        });
    });

    describe('createTask', () => {
        it('creates a task', async () => {
            Task.prototype.save = saveMock;

            const taskDTO = {
                title: 'title',
                description: 'description',
            };

            const user = {
                id: 1,
            };

            const result = await tasksService.createTask(taskDTO, user);

            expect(saveMock).toHaveBeenCalled();

            expect(result).toEqual({
                title: taskDTO.title,
                description: taskDTO.description,
                status: TaskStatus.OPEN,
                id: 1,
            });
        });
    });

    describe('getTaskById', () => {
        it('returns task if found', async () => {
            const task = {
                id: 1,
                title: 'Title',
                status: 'OPEN',
            };

            taskRepository.findOne.mockResolvedValue(task);

            const user = { id: 1 };

            const result = await tasksService.getTaskById(1, user);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1, userId: user.id },
            });

            expect(result).toEqual(task);
        });

        it('throws if task not found', async () => {
            taskRepository.findOne.mockResolvedValue(null);

            const user = { id: 1 };

            await expect(
                tasksService.getTaskById(1, user),
            ).rejects.toThrow();
        });
    });

    describe('deleteTask', () => {
        it('deletes and returns task if found', async () => {
            const task = { id: 1, title: 'Title' };

            taskRepository.findOne.mockResolvedValue(task);
            taskRepository.delete.mockResolvedValue(undefined);

            const user = { id: 1 };

            const result = await tasksService.deleteTask(1, user);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1, userId: user.id },
            });

            expect(taskRepository.delete).toHaveBeenCalledWith(1);

            expect(result).toEqual(task);
        });

        it('throws if task not found', async () => {
            taskRepository.findOne.mockResolvedValue(null);

            const user = { id: 1 };

            await expect(
                tasksService.deleteTask(1, user),
            ).rejects.toThrow();
        });
    });

    describe('updateTaskStatus', () => {
        it('updates task status if found', async () => {
            const task = {
                id: 1,
                status: TaskStatus.OPEN,
                save: jest.fn().mockResolvedValue(undefined),
            };

            taskRepository.findOne.mockResolvedValue(task);

            const user = { id: 1 };

            const result = await tasksService.updateTaskStatus(
                1,
                TaskStatus.DONE,
                user,
            );

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1, userId: user.id },
            });

            expect(task.status).toBe(TaskStatus.DONE);
            expect(task.save).toHaveBeenCalled();

            expect(result).toEqual(task);
        });

        it('throws if task not found', async () => {
            taskRepository.findOne.mockResolvedValue(null);

            const user = { id: 1 };

            await expect(
                tasksService.updateTaskStatus(1, TaskStatus.DONE, user),
            ).rejects.toThrow();
        });
    });
});