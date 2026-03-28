import { ApiProperty } from '@nestjs/swagger';
import {
    Min,
    Max,
    IsInt,
    IsOptional,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class CreateSymptomDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  type: string;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsNotEmpty()
  @ApiProperty()
  severity: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  description?: string;
}