import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { envs } from './envs';

import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.dbHost,
  port: envs.dbPort,
  username: envs.dbUsername,
  password: envs.dbPassword,
  database: envs.dbName,

  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },

  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,

  entities: [User, Product],
  migrations: [],
  subscribers: [],
});