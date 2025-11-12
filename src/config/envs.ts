import 'dotenv/config';

const jwtSecretFromEnv = process.env.JWT_SECRET;

if (!jwtSecretFromEnv) {
  console.error('FATAL ERROR: JWT_SECRET no está definida en .env');
  process.exit(1); 
}

export const envs = {
  port: process.env.PORT || 3000,
  
  dbHost: process.env.DB_HOST,
  dbPort: Number(process.env.DB_PORT),
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  
  jwtSecret: jwtSecretFromEnv,
};