import { User } from './user';
import { UserEntity } from './user.entity';

export abstract class UserMapper {
    static fromUserEntity(source: UserEntity): User {
        return {
            userId: source.userId,
            firstName: source.firstName,
            lastName: source.lastName,
            fullName: source.fullName,
            createdAt: source.createdAt,
            modifiedAt: source.modifiedAt,
        };
    }
}