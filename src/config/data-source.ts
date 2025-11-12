import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { envs } from './envs';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.dbHost,
  port: envs.dbPort,
  username: envs.dbUsername,
  password: envs.dbPassword,
  database: envs.dbName,

  // Configuración para Render
  ssl: true, 
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },

  synchronize: true,
  logging: false,

  entities: [],
  migrations: [],
  subscribers: [],
});