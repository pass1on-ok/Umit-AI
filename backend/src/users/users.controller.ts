import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Post('register')
  @ApiCreatedResponse({type: UserEntity})
  async register(@Body() registerDto: RegisterDto){
    return new UserEntity(await this.usersService.register(registerDto))
  }

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const isStaff = [Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST].includes(req.user.role);
    const isSelf = req.user.id === id;

    if (!isStaff && !isSelf) {
      throw new ForbiddenException("You can only view your own account.");
    }

    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new UserEntity(user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const isStaff = [Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST].includes(req.user.role);
    const isSelf = req.user.id === id;
    const isAdmin = req.user.role === Role.ADMIN;

    if (!isStaff && !isSelf) {
      throw new ForbiddenException("You can only update your own account.");
    }


    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id/profile')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST, Role.PATIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async updateProfile(@Param('id', ParseIntPipe) id: number, @Body() updateProfileDto: UpdateProfileDto, @Request() req) {
    const isStaff = [Role.ADMIN, Role.DOCTOR, Role.PSYCHOLOGIST].includes(req.user.role);
    const isSelf = req.user.id === id;

    if (!isStaff && !isSelf) {
      throw new ForbiddenException("You can only update your own profile.");
    }

    const updatedUser = await this.usersService.updateProfile(id, updateProfileDto);

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }


    return new UserEntity(updatedUser);
  }
}
