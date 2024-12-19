import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryColumn({
        name: 'user_id',
        type: 'uuid'
    })
    userId: string;

    @Column({
        name: 'first_name',
        nullable: true,
        length: 50
    })
    firstName: string;

    @Column({
        name: 'last_name',
        nullable: true,
        length: 50
    })
    lastName: string;

    @Column({
        name: 'full_name',
        nullable: true,
        length: 100
    })
    fullName: string;

    @Column({
        name: 'is_active',
        nullable: true
    })
    isActive: boolean;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        nullable: true
    })
    createdAt: Date;

    @Column({
        name: 'modified_at',
        type: 'timestamp',
        nullable: true
    })
    modifiedAt: Date;
}