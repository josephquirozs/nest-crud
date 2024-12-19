import { User } from './user';
import { UserEntity } from './user.entity';

export abstract class UserEntityMapper {
    static fromUser(source: User): UserEntity {
        return {
            userId: source.userId,
            firstName: source.firstName,
            lastName: source.lastName,
            fullName: null,
            isActive: null,
            createdAt: null,
            modifiedAt: null,
        };
    }
}