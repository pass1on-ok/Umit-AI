import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayMinSize, ArrayMaxSize, IsInt, Min, Max } from 'class-validator';


export class CreateHadsDto {
    @IsArray()
    @ArrayMinSize(14)
    @ArrayMaxSize(14)
    @IsInt({each: true})
    @Min(0, {each: true})
    @Max(3, {each: true})
    answers: number[];

}
