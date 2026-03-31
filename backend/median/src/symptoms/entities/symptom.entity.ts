import { Symptom } from "@prisma/client";
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { SymptomValue } from "@prisma/client";

export class SymptomValueEntity implements Partial<SymptomValue> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  severity: number;

  @ApiProperty()
  entryId: number;
}

export class SymptomEntity implements Partial<Symptom> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  userId: number;

  @ApiProperty({ required: false, type: UserEntity })
  user?: UserEntity;

  @ApiProperty({ type: () => SymptomValueEntity, isArray: true })
  values?: SymptomValueEntity[];

  constructor({ user, values, ...data }: Partial<SymptomEntity>) {
    Object.assign(this, data);

    if (user) {
      this.user = new UserEntity(user);
    }
    if (values) {
      this.values = values.map((v) => ({
        id: v.id,
        type: v.type,
        severity: v.severity,
        entryId: v.entryId,
      }));
    }
  }
}
