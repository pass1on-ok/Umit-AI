import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }



  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, roundsOfHashing,);

    createUserDto.password = hashedPassword;

    return this.prisma.user.create({ data: { ...createUserDto, profile: { create: {}, }, }, include: { profile: true } });
  }

  async register(registerDto: RegisterDto) {

    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, roundsOfHashing,);

    registerDto.password = hashedPassword

    return this.prisma.user.create({ data: { ...registerDto, role: Role.PATIENT, profile: { create: {}, }, }, include: { profile: true } });
  }

  findAll() {
    return this.prisma.user.findMany({ include: { profile: true }, });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id }, include: { profile: true }, });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({ where: { id }, data: updateUserDto, include: { profile: true }, });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const dataToUpdate: any = { ...updateProfileDto };

    if (updateProfileDto.dateOfBirth) {
      dataToUpdate.dateOfBirth = new Date(updateProfileDto.dateOfBirth);
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: dataToUpdate,
    });

    return this.findOne(userId);
  }
}
