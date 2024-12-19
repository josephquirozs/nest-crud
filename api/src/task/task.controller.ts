import { Body, Controller, Get, Param, Query, HttpCode, Delete, Put } from '@nestjs/common';
import { Task } from './task';
import tasksJson from './tasks.json';
import { v4 as uuidv4 } from 'uuid';
import { BackendError } from 'src/backend.error';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { type } from 'os';

@Controller('tasks')
export class TaskController {
    private tasks: Task[] = tasksJson;

    @Get()
    @ApiOperation({ summary: 'search' })
    search(@Query('searchValue') searchValue: string): Task[] {
        if (searchValue === undefined || searchValue.length === 0) {
            return this.tasks;
        }
        return this.tasks.filter((e) => {
            const formattedSearchValue = searchValue.trim().toLowerCase();
            return e.description.toLowerCase().includes(formattedSearchValue);
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'retrieve' })
    retrieve(@Param('id') id: string): Task {
        const index = this.tasks.findIndex((e) => e.id === id);
        if (index === -1) {
            throw new BackendError('Task id not exist');
        }
        return this.tasks.find((e) => e.id === id);
    }

    @Put()
    @HttpCode(200)
    @ApiOperation({ summary: 'register' })
    register(@Body() task: Task): Task {
        const isCreation = task.id === null;
        if (isCreation) {
            const newTask = structuredClone(task);
            newTask.id = uuidv4();
            this.tasks.push(newTask);
            return newTask;
        }
        const index = this.tasks.findIndex((e) => e.id === task.id);
        if (index === -1) {
            throw new BackendError('Task id not exist');
        }
        this.tasks[index] = task;
        return task;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'delete' })
    delete(@Param('id') id: string): void {
        const index = this.tasks.findIndex((e) => e.id === id);
        if (index === -1) {
            throw new BackendError('Task id not exist');
        }
        this.tasks = this.tasks.filter((e) => e.id !== id);
    }
}
