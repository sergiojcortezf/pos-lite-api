import 'dotenv/config';
import { AppDataSource } from './config/data-source';
import { User } from './users/user.entity';
import { envs } from './config/envs';

/**
 * Script de "Seed" (sembrado)
 * Se conecta a la BBDD y crea el usuario ADMIN si no existe.
 */
const seedDatabase = async () => {
  console.log('--- Iniciando script de Seed ---');
  
  try {
    await AppDataSource.initialize();
    console.log('Conexión a la BBDD establecida para el seed.');

    const userRepository = AppDataSource.getRepository(User);

    const adminUser = await userRepository.findOneBy({ email: envs.adminEmail });

    if (adminUser) {
      console.log('El usuario ADMIN ya existe. No se necesita acción.');
    } else {
      console.log('Creando usuario ADMIN...');
      const newAdmin = userRepository.create({
        name: 'Admin',
        email: envs.adminEmail,
        password: envs.adminPassword,
        roles: ['ADMIN', 'CASHIER'],
      });

      await userRepository.save(newAdmin);
      console.log('¡Usuario ADMIN creado exitosamente!');
    }

  } catch (error) {
    console.error('--- ERROR DURANTE EL SEED ---');
    console.error(error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('Desconectado de la BBDD.');
    console.log('--- Script de Seed finalizado ---');
  }
};

seedDatabase();