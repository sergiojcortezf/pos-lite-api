import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

import * as ExcelJS from 'exceljs';
import { Readable } from 'stream';

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

  public async uploadCatalog(fileBuffer: Buffer) {    
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.read(stream);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error('No se encontró ninguna hoja de trabajo en el archivo.');
    }

    let created = 0;
    let updated = 0;
    let errors = 0;
    const totalRows = worksheet.rowCount - 1;

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      
      try {
        const barcode = row.getCell(1).value as string;
        const name = row.getCell(2).value as string;
        const price = Number(row.getCell(3).value);
        const stock = Number(row.getCell(4).value);

        if (!barcode || !name || isNaN(price) || isNaN(stock)) {
          throw new Error(`Datos inválidos o incompletos en la fila ${i}`);
        }

        let product = await this.productRepository.findOneBy({ barcode });

        if (product) {
          product.name = name;
          product.price = price;
          product.stock = stock;
          await this.productRepository.save(product);
          updated++;
        } else {
          const newProduct = this.productRepository.create({
            barcode,
            name,
            price,
            stock,
          });
          await this.productRepository.save(newProduct);
          created++;
        }

      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error procesando fila ${i}:`, error.message);
        } else {
          console.error(`Error desconocido procesando fila ${i}:`, error);
        }
        errors++;
      }
    }

    return {
      totalRows,
      created,
      updated,
      errors,
    };
  }

}