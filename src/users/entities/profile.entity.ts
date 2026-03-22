import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '@prisma/client';

export class ProfileEntity implements Profile {
  constructor(partial: Partial<ProfileEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty({ required: false, nullable: true })
  gender: string | null;

  @ApiProperty({ required: false, nullable: true })
  dateOfBirth: Date | null;

  @ApiProperty({ required: false, nullable: true })
  address: string | null;

  @ApiProperty()
  userId: number;
}