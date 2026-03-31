import { Symptom } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SymptomEntity implements Symptom {
  @ApiProperty() id: number;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty() pain: number;
  @ApiProperty() fatigue: number;
  @ApiProperty() appetite: number;
  @ApiProperty() nausea: number;
  @ApiProperty() sleep: number;
  @ApiProperty({ required: false, nullable: true }) userId: number | null;

  constructor(data: Partial<SymptomEntity>) {
    Object.assign(this, data);
  }
}
