// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, Raw } from 'typeorm';

// import { Product } from '../../entities/product.entity';
// import { Category } from '../../entities/category.entity';
// import { CreateProductDto } from './dto/create-product.dto';

// @Injectable()
// export class ProductsService {
//   constructor(
//     @InjectRepository(Product)
//     private readonly productRepository: Repository<Product>,
//     @InjectRepository(Category)
//     private readonly categoryRepository: Repository<Category>,
//   ) {}

//   async create(dto: CreateProductDto) {
//     const category = await this.categoryRepository.findOne({ 
//       where: { id: dto.categoryId },
//     });

//     if (!category) {
//       throw new NotFoundException('Category not found');
//     }

//     const product = this.productRepository.create({
//       name: dto.name,
//       description: dto.description,
//       price: dto.price,
//       stock: dto.stock,
//       imageUrl: dto.imageUrl,
//       category,
//     });

//     return this.productRepository.save(product);
//   }

//   async find(search?: string) {
//     return this.productRepository.find({
//       where: search
//         ? {
//             name: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:search)`, {
//               search: `%${search}%`,
//             }),
//           }
//         : {},
//       relations: { category: true },
//     });
//   }

//   async findOne(id: number) {
//     const product = await this.productRepository.findOne({
//       where: { id },
//       relations: { category: true },
//     });

//     if (!product) {
//       throw new NotFoundException('Product not found');
//     }

//     return product;
//   }

//   async remove(id: number) {
//     const product = await this.findOne(id);
//     await this.productRepository.remove(product);
//     return { message: 'Product deleted successfully' };
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';

import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      imageUrl: dto.imageUrl,
      category,
    });

    return this.productRepository.save(product);
  }

  async find(search?: string) {
    return this.productRepository.find({
      where: search
        ? {
            name: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:search)`, {
              search: `%${search}%`,
            }),
          }
        : {},
      relations: { category: true },
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);

    return {
      message: 'Product deleted successfully',
    };
  }
}