import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  import { Category } from './category.entity';

  @Entity('products')
  export class Product{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column('text')
    description:string;

    @Column('decimal', { precision: 10, scale: 2 }) 
    price:number;

    @Column({default:0})
    stock:number;

    @Column({nullable:true})
    imageUrl:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @ManyToOne(()=>Category,{onDelete:'CASCADE'})
    category:Category;

  }