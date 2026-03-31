import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Request, ForbiddenException } from '@nestjs/common';
import { HadsService } from './hads.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateHadsDto } from './dto/create-hads.dto';
import { UpdateHadsDto } from './dto/update-hads.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HadsEntity } from './entities/hads.entity';

@Controller('hads')
@ApiTags('hads')
export class HadsController {
  constructor(private readonly hadsService: HadsService) { }

  @Post()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: HadsEntity })
  async create(@Request() req, @Body() createHadsDto: CreateHadsDto) {
    return new HadsEntity(await this.hadsService.create(req.user.id, createHadsDto));
  }

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: HadsEntity, isArray: true })
  async findAll() {
    const hads = await this.hadsService.findAll();
    return hads.map((hads) => new HadsEntity(hads));
  }

  @Get('my-results')
  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth()
  async findAllMyResults(@Request() req) {
    return this.hadsService.findAllForUser(req.user.id);
  }
  
  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: HadsEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const hads = await this.hadsService.findOne(id);
    if (!hads) {
      throw new NotFoundException(`HADS with ${id} does not exist.`);
    }
    return new HadsEntity(hads);
  }
}
