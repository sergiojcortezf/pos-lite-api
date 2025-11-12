import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

interface FindAllQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export class ProductsService {
  private readonly productRepository: Repository<Product> = AppDataSource.getRepository(Product);

  public async create(createDto: CreateProductDto) {
    const barcodeExists = await this.productRepository.findOneBy({ 
      barcode: createDto.barcode 
    });
    if (barcodeExists) {
      throw new Error('Ya existe un producto con ese código de barras.');
    }

    const product = this.productRepository.create(createDto);
    await this.productRepository.save(product);
    return product;
  }

  public async findAll(query: FindAllQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Product> = {};
    if (query.category) {
      where.category = query.category;
    }
    if (query.search) {
      where.name = Like(`%${query.search}%`);
    }

    const [products, total] = await this.productRepository.findAndCount({
      where: where,
      take: limit,
      skip: skip,
    });

    return {
      data: products,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new Error('Producto no encontrado.');
    }
    return product;
  }

  public async update(id: string, updateDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateDto,
    });

    if (!product) {
      throw new Error('Producto no encontrado.');
    }

    await this.productRepository.save(product);
    return product;
  }

  public async delete(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: 'Producto eliminado exitosamente.' };
  }
}