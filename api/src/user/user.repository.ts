import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { DeepPartial, ILike, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { UserSearchArgs } from './user.search.args';
import { CustomPage } from 'src/custom.page';
import assert from 'node:assert';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userTypeOrmRepository: Repository<UserEntity>
    ) { }

    async populate(): Promise<void> {
        const currentDatetime = new Date(Date.now());
        for (let index = 1; index <= 100; index++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const newUser: UserEntity = {
                userId: uuidv4(),
                firstName: firstName,
                lastName: lastName,
                fullName: this.generateFullName({
                    firstName: firstName,
                    lastName: lastName
                }),
                isActive: true,
                createdAt: currentDatetime,
                modifiedAt: currentDatetime
            };
            await this.userTypeOrmRepository.insert(newUser);
        }
    }

    async search(args: UserSearchArgs): Promise<CustomPage<UserEntity>> {
        assert(args, "Argument 'args' must not be undefined or null");
        const {
            pageNumber,
            pageSize,
            searchValue
        } = args;
        assert(pageNumber, "Property 'pageNumber' must not be undefined or null");
        assert(pageSize, "Property 'pageSize' must not be undefined or null");
        const [foundUsers, counted] = await this.userTypeOrmRepository.findAndCount({
            where: {
                isActive: true,
                fullName: searchValue ? ILike(`%${searchValue}%`) : undefined
            },
            order: {
                fullName: { direction: 'asc' },
            },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize
        });
        return {
            content: foundUsers,
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalElements: counted,
            totalPages: Math.ceil(counted / pageSize)
        };
    }

    async retrieve(userId: string): Promise<UserEntity> {
        assert(userId, "Argument 'userId' must not be undefined, null or empty");
        return await this.userTypeOrmRepository.findOneBy({
            isActive: true,
            userId: userId
        });
    }

    async register(user: UserEntity): Promise<UserEntity> {
        assert(user, "Argument 'user' must not be undefined or null");
        const isCreation = !user.userId;
        const currentDatetime = new Date();
        if (isCreation) {
            const clonedUser = structuredClone(user);
            const newUser = this.userTypeOrmRepository.merge(clonedUser, {
                userId: uuidv4(),
                fullName: this.generateFullName({
                    firstName: clonedUser.firstName,
                    lastName: clonedUser.lastName
                }),
                isActive: true,
                createdAt: currentDatetime,
                modifiedAt: currentDatetime
            });
            return await this.userTypeOrmRepository.save(newUser);
        }
        const foundUser = await this.userTypeOrmRepository.findOneBy({
            isActive: true,
            userId: user.userId
        });
        const partialClonedUser = this.notUndefinedAndNullClone(user);
        const editedUser = this.userTypeOrmRepository.merge(foundUser, partialClonedUser, {
            fullName: this.generateFullName({
                firstName: partialClonedUser.firstName,
                lastName: partialClonedUser.lastName
            }),
            modifiedAt: currentDatetime,
        });
        return await this.userTypeOrmRepository.save(editedUser);
    }

    async delete(userId: string): Promise<void> {
        assert(userId, "Argument 'userId' must not be undefined, null or empty");
        const foundUser = await this.userTypeOrmRepository.findOneBy({
            isActive: true,
            userId: userId
        });
        const editedUser = this.userTypeOrmRepository.merge(foundUser, {
            isActive: false,
            modifiedAt: new Date()
        });
        await this.userTypeOrmRepository.save(editedUser);
    }

    private generateFullName({
        firstName,
        lastName
    }: {
        firstName: string,
        lastName: string
    }): string {
        return `${firstName} ${lastName}`;
    }

    private notUndefinedAndNullClone<T>(value: T): DeepPartial<T> {
        const filteredValues = Object.entries(value).filter(([_, e]) => e !== undefined && e !== null);
        return Object.fromEntries(filteredValues) as DeepPartial<T>;
    }
}