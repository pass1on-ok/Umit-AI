import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, IsArray, ValidateNested, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class SymptomValueDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'pain', description: 'The name of the symptom' })
  type: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsNotEmpty()
  @ApiProperty({ example: 5, description: 'Severity score from 0 to 10' })
  severity: number;
}

export class CreateSymptomDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false,  })
  description?: string;

  @IsArray()
  @IsNotEmpty() 
  @ValidateNested({ each: true })
  @Type(() => SymptomValueDto)
  @ApiProperty({ type: [SymptomValueDto],  })
  values: SymptomValueDto[];
}