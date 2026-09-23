import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserManagementResponseDto } from './dto/user-management-response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiCookieAuth()
@ApiForbiddenResponse({ description: 'Only administrators can manage users.' })
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ type: [UserManagementResponseDto] })
  @Get()
  listUsers() {
    return this.usersService.listUsers();
  }

  @ApiOperation({ summary: 'Create a user account' })
  @ApiCreatedResponse({ type: UserManagementResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid professor assignment.' })
  @ApiConflictResponse({ description: 'Email or professor is already assigned.' })
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @ApiOperation({ summary: 'Change a user role' })
  @ApiOkResponse({ type: UserManagementResponseDto })
  @ApiBadRequestResponse({ description: 'The current account cannot change its own role.' })
  @ApiConflictResponse({ description: 'The last administrator cannot be demoted.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.usersService.updateRole(id, dto.role, currentUser.id);
  }
}
