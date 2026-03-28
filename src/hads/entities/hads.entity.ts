import { ApiProperty } from "@nestjs/swagger";
import { HadsResponse } from "@prisma/client";

export class HadsEntity implements HadsResponse {
    constructor(partial: Partial<HadsEntity>) {
    Object.assign(this, partial);
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ type: [Number] })
    answers: number[];

    @ApiProperty()
    anxietyScore: number;

    @ApiProperty()
    depressionScore: number;

    @ApiProperty()
    userId: number;
}
