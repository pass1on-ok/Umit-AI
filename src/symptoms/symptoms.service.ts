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
    return this.prisma.symptom.create({ data: { ...createSymptomDto, userId: userId } });
  }

  findAll(user: any) {
    const isStaff = [Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST].includes(user.role);
    return this.prisma.symptom.findMany({ where: isStaff ? {} : { userId: user.id }, })
  }

  async findOne(id: number, user: any) {
    const symptom = await this.prisma.symptom.findUnique({ where: { id } });
    if (!symptom) throw new NotFoundException(`Symptom ${id} not found`);

    const isStaff = [Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST].includes(user.role);
    if (!isStaff && symptom.userId !== user.id) {
      throw new ForbiddenException('You do not have access to this symptom record');
    }
    return symptom;
  }

  async update(id: number, updateSymptomDto: UpdateSymptomDto, user: any) {
    const symptom = await this.prisma.symptom.findUnique({ where: { id } });

    if (!symptom) throw new NotFoundException(`Symptom ${id} not found`);

    const canEdit = user.role === Role.ADMIN || user.role === Role.DOCTOR || symptom.userId === user.id;

    if (!canEdit) {
      throw new ForbiddenException('Access Denied');
    }
    return this.prisma.symptom.update({
      where: { id },
      data: updateSymptomDto,
    });
  }

  async remove(id: number, user: any) {
     const symptom = await this.prisma.symptom.findUnique({ where: { id } });

    if (!symptom) throw new NotFoundException(`Symptom ${id} not found`);

    const canDelete = user.role === Role.ADMIN || user.role === Role.DOCTOR || symptom.userId === user.id;

    if (!canDelete) {
      throw new ForbiddenException('Access Denied');
    }

    return this.prisma.symptom.delete({ where: { id } });
  }
}
