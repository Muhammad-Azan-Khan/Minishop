import {
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Req,
    UseGuards,
  } from '@nestjs/common';

  
  import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UsersService } from './users.service';
  
  @Controller('users')
  export class UsersController {
    
    constructor(
    private readonly usersService: UsersService,
  ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Req() req: any) {
      return req.user;
    }

    // Get all users (Admin only)
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAllUsers() {
    return this.usersService.findAllUsers();
  }


  // Delete user (Admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.remove(id);
  }

  }

  

