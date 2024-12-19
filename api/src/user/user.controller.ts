import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { CustomPage } from 'src/custom.page';
import { User } from './user';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UserController {
    constructor(
        private readonly service: UserService
    ) { }

    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'populate' })
    populate(): Promise<void> {
        return this.service.populate();
    }

    @Get()
    @ApiOperation({ summary: 'search' })
    @ApiQuery({ name: 'searchValue', required: false, type: String })
    search(
        @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number,
        @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
        @Query('searchValue') searchValue?: string
    ): Promise<CustomPage<User>> {
        return this.service.search({
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchValue: searchValue
        });
    }

    @Get(':userId')
    @ApiOperation({ summary: 'retrieve' })
    retrieve(@Param('userId') userId: string): Promise<User> {
        return this.service.retrieve(userId);
    }

    @Put()
    @ApiOperation({ summary: 'register' })
    register(@Body() user: User): Promise<User> {
        return this.service.register(user);
    }

    @Delete(':userId')
    @ApiOperation({ summary: 'delete' })
    delete(@Param('userId') userId: string): Promise<void> {
        return this.service.delete(userId);
    }
}
