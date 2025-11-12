import { Request, Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

export class ProductsController {
  private productsService = new ProductsService();

  public create = async (req: Request, res: Response) => {
    const createDto = req.body as CreateProductDto;

    const product = await this.productsService.create(createDto);
    return res.status(201).json(product);
  }

  public findAll = async (req: Request, res: Response) => {
    const query = req.query; 
    const result = await this.productsService.findAll(query);
    return res.status(200).json(result);
  }

  public findOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productsService.findOne(id);
    return res.status(200).json(product);
  }

  public update = async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateDto = req.body as UpdateProductDto;

    const product = await this.productsService.update(id, updateDto);
    return res.status(200).json(product);
  }

  public delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.productsService.delete(id);
    return res.status(200).json(result);
  }

  public uploadCatalog = async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      throw new Error('No se recibió ningún archivo .xlsx');
    }

    const result = await this.productsService.uploadCatalog(file.buffer);
    return res.status(200).json({
      message: 'Catálogo procesado exitosamente.',
      summary: result
    });
  }
}