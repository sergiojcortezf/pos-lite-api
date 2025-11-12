import { ProductsService } from './products.service';
import { AppDataSource } from '../config/data-source';
import { Product } from './product.entity';

const mockProductRepository = AppDataSource.getRepository(Product) as jest.Mocked<any>;

describe('ProductsService', () => {
  let productsService: ProductsService;

  beforeEach(() => {
    jest.clearAllMocks();
    productsService = new ProductsService();
  });

  // --- Prueba de Carga de Archivos ---
  it('debería crear y actualizar productos desde un Excel', async () => {
    const mockFileBuffer = Buffer.from('fake-excel-data');
    

    mockProductRepository.findOneBy
      .mockResolvedValueOnce(null) // Primera llamada (barcode '111')
      .mockResolvedValueOnce({ id: 'existing-id', barcode: '222' }); // Segunda llamada (barcode '222')

    const result = await productsService.uploadCatalog(mockFileBuffer);

    expect(result.totalRows).toBe(2);
    expect(result.created).toBe(1); // '111' se creó
    expect(result.updated).toBe(1); // '222' se actualizó
    expect(result.errors).toBe(0);
    
    expect(mockProductRepository.save).toHaveBeenCalledTimes(2);
  });
});