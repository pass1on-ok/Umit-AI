import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe,UseGuards, Request } from '@nestjs/common';
import { SymptomsService } from './symptoms.service';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { ApiTags } from '@nestjs/swagger';

import { ApiCreatedResponse, ApiOkResponse,ApiBearerAuth } from '@nestjs/swagger';
import { SymptomEntity } from './entities/symptom.entity';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@Controller('symptoms')
@ApiTags('symptoms')

export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) { }


  @Post()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: SymptomEntity })
  async create(@Body() createSymptomDto: CreateSymptomDto, @Request() req) {
    return new SymptomEntity(
      await this.symptomsService.create(createSymptomDto, req.user.id),
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: SymptomEntity, isArray: true })
  async findAll(@Request() req) {
    const Symptoms = await this.symptomsService.findAll(req.user);
    return Symptoms.map((Symptom) => new SymptomEntity(Symptom));
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: SymptomEntity })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const Symptom = await this.symptomsService.findOne(id, req.user);
    return new SymptomEntity(Symptom);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: SymptomEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() updateSymptomDto: UpdateSymptomDto,) {
    return new SymptomEntity(
      await this.symptomsService.update(id, updateSymptomDto, req.user),
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: SymptomEntity })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return new SymptomEntity(await this.symptomsService.remove(id, req.user));
  }
}
