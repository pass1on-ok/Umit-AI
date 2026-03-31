import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '@prisma/client';

export class ProfileEntity implements Profile {
  @ApiProperty() id: number;
  @ApiProperty({ nullable: true }) gender: string | null;
  @ApiProperty({ nullable: true }) dateOfBirth: Date | null;
  @ApiProperty({ nullable: true }) address: string | null;
  @ApiProperty({ nullable: true }) phone: string | null;
  @ApiProperty({ nullable: true }) diagnosis: string | null;
  @ApiProperty({ nullable: true }) stage: string | null;
  @ApiProperty({ nullable: true }) treatmentPhase: string | null;
  @ApiProperty() userId: number;

  constructor(data: Partial<ProfileEntity>) {
    Object.assign(this, data);
  }
}
