import { Injectable } from '@nestjs/common';
import { CreateHadsDto } from './dto/create-hads.dto';
import { PrismaService } from 'src/prisma/prisma.service';

// HADS question order (0-indexed): A D A D A D A D A D A D A D
// Anxiety:    indices 0,2,4,6,8,10,12  (questions 1,3,5,7,9,11,13)
// Depression: indices 1,3,5,7,9,11,13  (questions 2,4,6,8,10,12,14)
const ANXIETY_INDICES    = [0, 2, 4, 6, 8, 10, 12];
const DEPRESSION_INDICES = [1, 3, 5, 7, 9, 11, 13];

@Injectable()
export class HadsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createHadsDto: CreateHadsDto) {
    const { answers } = createHadsDto;

    const anxietyScore    = ANXIETY_INDICES.reduce((sum, i) => sum + (answers[i] ?? 0), 0);
    const depressionScore = DEPRESSION_INDICES.reduce((sum, i) => sum + (answers[i] ?? 0), 0);

    return this.prisma.hadsResponse.create({
      data: { userId, answers, anxietyScore, depressionScore },
    });
  }

  findAll() {
    return this.prisma.hadsResponse.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.hadsResponse.findUnique({ where: { id } });
  }

  findByUser(userId: number) {
    return this.prisma.hadsResponse.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
