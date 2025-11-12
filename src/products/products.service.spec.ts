import { ProductsService } from './products.service';
import { AppDataSource } from '../config/data-source';
import { Product } from './product.entity';
import { AppError } from '../utils/AppError';
import { CreateProductDto } from './dtos/create-product.dto';

const mockProductRepository = AppDataSource.getRepository(Product) as jest.Mocked<any>;

describe('ProductsService', () => {
  let productsService: ProductsService;

  beforeEach(() => {
    jest.clearAllMocks();
    productsService = new ProductsService();
  });

  it('debería crear y actualizar productos desde un Excel', async () => {
    const mockFileBuffer = Buffer.from('fake-excel-data');
    
    mockProductRepository.findOneBy
      .mockResolvedValueOnce(null) // Primera llamada (barcode '111')
      .mockResolvedValueOnce({ id: 'existing-id', barcode: '222' }); // Segunda llamada (barcode '222')

    const result = await productsService.uploadCatalog(mockFileBuffer);

    expect(result.totalRows).toBe(2);
    expect(result.created).toBe(1);
    expect(result.updated).toBe(1);
    expect(result.errors).toBe(0);
    expect(mockProductRepository.save).toHaveBeenCalledTimes(2);
  });
  
  it('debería lanzar un error 400 al crear un producto con barcode duplicado', async () => {
    // 1. Preparación
    const createDto: CreateProductDto = {
      name: 'Producto Duplicado',
      price: 10,
      stock: 10,
      barcode: '123456789'
    };
    
    const mockExistingProduct = {
      id: 'mock-id',
      ...createDto
    };

    mockProductRepository.findOneBy.mockResolvedValue(mockExistingProduct);

    await expect(productsService.create(createDto)).rejects.toThrow(AppError);
    await expect(productsService.create(createDto)).rejects.toHaveProperty('statusCode', 400);

    expect(mockProductRepository.save).not.toHaveBeenCalled();
  });
});