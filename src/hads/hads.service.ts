import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHadsDto } from './dto/create-hads.dto';
import { UpdateHadsDto } from './dto/update-hads.dto';
import { PrismaService } from 'src/prisma/prisma.service';



@Injectable()
export class HadsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createHadsDto: CreateHadsDto){
    const answers = createHadsDto.answers
    
    let anxietyScore = 0;
    let depressionScore = 0;

    answers.forEach((score, index) =>{
      if (index % 2 == 0) anxietyScore += score;
      else depressionScore += score
    });

    return this.prisma.hadsResponse.create({
      data: {
        userId,
        answers,
        anxietyScore,
        depressionScore,
      }
    })
  }

  findAll() {
    return this.prisma.hadsResponse.findMany();
  }

  findOne(id: number) {
    return this.prisma.hadsResponse.findUnique({ where: { id } });
  }

}
