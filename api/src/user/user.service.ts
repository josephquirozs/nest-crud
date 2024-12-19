import { Injectable } from '@nestjs/common';
import { UserSearchArgs } from './user.search.args';
import { CustomPage } from 'src/custom.page';
import { UserRepository } from './user.repository';
import { User } from './user';
import { UserMapper } from './user.mapper';
import { UserEntityMapper } from './user.entity.mapper';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async populate(): Promise<void> {
        await this.userRepository.populate();
    }

    async search(args: UserSearchArgs): Promise<CustomPage<User>> {
        const pageEntity = await this.userRepository.search(args);
        return {
            content: pageEntity.content.map((e) => UserMapper.fromUserEntity(e)),
            pageNumber: pageEntity.pageNumber,
            pageSize: pageEntity.pageSize,
            totalElements: pageEntity.totalElements,
            totalPages: pageEntity.totalPages
        };
    }

    async retrieve(userId: string): Promise<User> {
        const userEntity = await this.userRepository.retrieve(userId);
        return UserMapper.fromUserEntity(userEntity);
    }

    async register(user: User): Promise<User> {
        const userEntity = UserEntityMapper.fromUser(user);
        const registeredUser = await this.userRepository.register(userEntity);
        return UserMapper.fromUserEntity(registeredUser);
    }

    async delete(userId: string): Promise<void> {
        await this.userRepository.delete(userId);
    }
}
