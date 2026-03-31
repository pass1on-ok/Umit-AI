import {
  Controller, Get, Post, Body, Param,
  UseGuards, ParseIntPipe, Request, NotFoundException,
} from '@nestjs/common';
import { HadsService } from './hads.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateHadsDto } from './dto/create-hads.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HadsEntity } from './entities/hads.entity';

@Controller('hads')
@ApiTags('hads')
export class HadsController {
  constructor(private readonly hadsService: HadsService) {}

  // Submit a new HADS test (any authenticated user)
  @Post()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: HadsEntity })
  async create(@Request() req, @Body() createHadsDto: CreateHadsDto) {
    return new HadsEntity(await this.hadsService.create(req.user.id, createHadsDto));
  }

  // Get all results — staff only
  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: HadsEntity, isArray: true })
  async findAll() {
    const hads = await this.hadsService.findAll();
    return hads.map(h => new HadsEntity(h));
  }

  // Get current user's own results
  @Get('my')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: HadsEntity, isArray: true })
  async findMine(@Request() req) {
    const hads = await this.hadsService.findByUser(req.user.id);
    return hads.map(h => new HadsEntity(h));
  }

  // Get one by id
  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: HadsEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const hads = await this.hadsService.findOne(id);
    if (!hads) throw new NotFoundException(`HADS with id ${id} not found`);
    return new HadsEntity(hads);
  }
}
