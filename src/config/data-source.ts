import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { envs } from './envs';

import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

const isProduction = process.env.RENDER === 'true';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.dbHost,
  port: envs.dbPort,
  username: envs.dbUsername,
  password: envs.dbPassword,
  database: envs.dbName,

  // Configuración para Render
  ssl: !isProduction, 
  extra: isProduction 
    ? {} 
    : { ssl: { rejectUnauthorized: false } },
  synchronize: !isProduction,
  logging: false,

  entities: [User, Product],
  migrations: [],
  subscribers: [],
});