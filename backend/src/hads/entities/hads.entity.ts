import { ApiProperty } from '@nestjs/swagger';
import { HadsResponse } from '@prisma/client';

export class HadsEntity implements HadsResponse {
  @ApiProperty() id: number;
  @ApiProperty() createdAt: Date;
  @ApiProperty() answers: number[];
  @ApiProperty() anxietyScore: number;
  @ApiProperty() depressionScore: number;
  @ApiProperty() userId: number;

  constructor(data: Partial<HadsEntity>) {
    Object.assign(this, data);
  }
}
