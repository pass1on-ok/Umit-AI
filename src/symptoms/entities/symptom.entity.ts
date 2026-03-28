import { Symptom } from "@prisma/client";
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class SymptomEntity implements Symptom {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    type: string;

    @ApiProperty()
    severity: number;

    @ApiProperty({ required: false, nullable: true })
    description: string | null;

    @ApiProperty({ required: false, nullable: true })
    userId: number | null;

    @ApiProperty({ required: false, type: UserEntity })
    user?: UserEntity | null;

    constructor({ user, ...data }: Partial<SymptomEntity>) {
        Object.assign(this, data);

        if (user) {
            this.user = new UserEntity(user);
        }
    }

}
