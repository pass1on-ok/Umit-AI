import { Injectable } from '@nestjs/common';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class SymptomsService {
  constructor(private prisma: PrismaService) { }


  create(createSymptomDto: CreateSymptomDto, userId: number) {
    return this.prisma.symptom.create({
    data: {
      userId: userId,
      description: createSymptomDto.description,
      values: {
        create: createSymptomDto.values, 
      },
    },
    include: {
      values: true, 
    },
  });
}

findAll(user: any) {
  const isStaff = [Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST].includes(user.role);

  return this.prisma.symptom.findMany({
    where: isStaff ? {} : { userId: user.id },
    include: {
      values: true,
    },    orderBy: {
      createdAt: 'desc',
    },
  });
}

async findOne(id: number, user: any) {
  const entry = await this.prisma.symptom.findUnique({
    where: { id },
    include: { values: true },
  });

  if (!entry) {
    throw new NotFoundException(`Symptom record ${id} not found`);
  }

  const isStaff = [Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST].includes(user.role);
    if (!isStaff && entry.userId !== user.id) {
    throw new ForbiddenException('You do not have access to this symptom record');
  }

  return entry;
}

async update(id: number, updateSymptomDto: UpdateSymptomDto, user: any) {
  const entry = await this.prisma.symptom.findUnique({ 
    where: { id },
    include: { values: true } 
  });

  if (!entry) throw new NotFoundException(`Symptom entry ${id} not found`);

  const canEdit = user.role === 'ADMIN' || user.role === 'DOCTOR' || entry.userId === user.id;
  if (!canEdit) throw new ForbiddenException('Access Denied');

  return this.prisma.symptom.update({
    where: { id },
    data: {
      description: updateSymptomDto.description,
      values: {
        deleteMany: {}, 
        create: updateSymptomDto.values?.map(v => ({
          type: v.type,
          severity: v.severity
        }))
      }
    },
    include: { values: true }
  });
}

async remove(id: number, user: any) {
  const entry = await this.prisma.symptom.findUnique({ 
    where: { id } 
  });

  if (!entry) {
    throw new NotFoundException(`Symptom record ${id} not found`);
  }

  const isStaff = [Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST].includes(user.role);
  const isOwner = entry.userId === user.id;

  if (!isStaff && !isOwner) {
    throw new ForbiddenException('You do not have permission to delete this record');
  }

  return this.prisma.symptom.delete({ 
    where: { id } 
  });
  }
}