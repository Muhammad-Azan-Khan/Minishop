import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Cart } from '../../entities/cart.entity';
import { CartItem } from '../../entities/cart-item.entity';
import { Product } from '../../entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async checkout(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      totalAmount += Number(product.price) * cartItem.quantity;

      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = cartItem.quantity;
      orderItem.priceAtPurchase = product.price;
      orderItems.push(orderItem);

      product.stock = Math.max(product.stock - cartItem.quantity, 0);
      await this.productRepository.save(product);
    }

    const order = this.orderRepository.create({
      user: { id: userId } as any,
      items: orderItems,
      totalAmount,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    await this.cartItemRepository.remove(cart.items);

    return {
      message: 'Order placed successfully',
      order: savedOrder,
    };
  }

  async findMyOrders(userId: number) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: { items: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllOrders() {
    return this.orderRepository.find({
      relations: { items: true, user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    return this.orderRepository.save(order);
  }
}