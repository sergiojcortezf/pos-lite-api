import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

const mockUserRepo = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockProductRepo = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
};

jest.mock('../config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn((entity: any) => {
      if (entity === User) {
        return mockUserRepo;
      }
      if (entity === Product) {
        return mockProductRepo;
      }
      return {};
    }),
  },
}));


jest.mock('bcryptjs', () => ({
  genSaltSync: () => 'mocked_salt',
  hashSync: (password: string) => `hashed_${password}`,
  compareSync: (dtoPass: string, dbPass: string) => dtoPass === dbPass.replace('hashed_', ''),
}));

jest.mock('jsonwebtoken', () => ({
  sign: () => 'mocked_jwt_token',
}));

jest.mock('exceljs', () => ({
  Workbook: jest.fn(() => ({
    xlsx: {
      read: jest.fn().mockResolvedValue(undefined),
    },
    worksheets: [
      {
        rowCount: 3, // 1 cabecera + 2 filas de datos
        getRow: jest.fn((i) => {
          const rowData = {
            2: [null, {value: '111'}, {value: 'Producto A'}, {value: 10}, {value: 100}],
            3: [null, {value: '222'}, {value: 'Producto B'}, {value: 20}, {value: 200}]
          };
          if (i === 2) {
            return { getCell: (c: number) => rowData[2][c] };
          }
          if (i === 3) {
            return { getCell: (c: number) => rowData[3][c] };
          }
          return { getCell: () => ({ value: null }) }; 
        }),
      },
    ],
  })),
}));