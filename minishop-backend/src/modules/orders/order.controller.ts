import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    ParseIntPipe,
    Req,
    UseGuards,
  } from '@nestjs/common';

  import { OrdersService } from './order.service';
  import { OrderStatus } from '../../entities/order.entity';
  import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
  import { RolesGuard } from '../../guards/roles.guard';
  import { Roles } from '../../decorators/roles.decorator';
  
  @Controller('orders')
  @UseGuards(JwtAuthGuard)
  export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
  
    @Post('checkout')
    checkout(@Req() req: any) {
      return this.ordersService.checkout(req.user.userId);
    }
  
    @Get('my')
    findMyOrders(@Req() req: any) {
      return this.ordersService.findMyOrders(req.user.userId);
    }
  
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get('all')
    findAllOrders() {
      return this.ordersService.findAllOrders();
    }
  
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Patch(':id/status')
    updateStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body('status') status: OrderStatus,
    ) {
      return this.ordersService.updateStatus(id, status);
    }
  }