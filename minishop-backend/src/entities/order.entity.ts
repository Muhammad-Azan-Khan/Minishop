import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
  } from 'typeorm';
  
  import { User } from './user.entity';
  import { OrderItem } from './order-item.entity';  

  
  export enum OrderStatus {
    PENDING = 'PENDING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    PROCESSING ='PROCESSING',
    CANCELLED = 'CANCELLED',
  }
  
  @Entity('orders')
  export class Order {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, {
  onDelete: "CASCADE",
})
user: User;
  
    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
  
    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;
  
    @Column({
      type: 'enum',
      enum: OrderStatus,
      default: OrderStatus.PENDING,
    })
    status: OrderStatus;
  
    @CreateDateColumn()
    createdAt: Date;
  }
