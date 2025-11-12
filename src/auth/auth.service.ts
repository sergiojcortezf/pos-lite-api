import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../users/user.entity';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { envs } from '../config/envs';

export class AuthService {
  // Obtenemos el "repositorio" de la entidad User
  // Esto es lo que nos permite hacer .find(), .create(), .save(), etc.
  private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

  // --- MÉTODO DE REGISTRO ---
  public async register(registerDto: RegisterUserDto) {
    const { email } = registerDto;

    // 1. Verificar si el email ya existe
    const userExists = await this.userRepository.findOneBy({ email });
    if (userExists) {
      // Lanzamos un error que el controlador atrapará
      throw new Error('El correo electrónico ya está en uso.');
    }

    // 2. Crear la nueva instancia de usuario
    // El DTO (registerDto) tiene la forma { name, email, password }
    const user = this.userRepository.create(registerDto);
    
    // NOTA: No necesitamos hashear la contraseña aquí.
    // ¡Nuestro @BeforeInsert() en 'user.entity.ts' lo hace automáticamente!
    // Tampoco asignamos 'roles', porque la entidad ya lo pone 'CASHIER' por defecto.

    // 3. Guardar el usuario en la base de datos
    await this.userRepository.save(user);

    // 4. Generar un token para el nuevo usuario
    const token = this.generateToken(user);

    // 5. Quitar la contraseña del objeto antes de devolverlo (¡Seguridad!)
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token: token,
    };
  }

  // --- MÉTODO DE LOGIN ---
  public async login(loginDto: LoginUserDto) {
    const { email, password: passwordDto } = loginDto;

    // 1. Buscar al usuario por email
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error('Credenciales inválidas.'); // Email no encontrado
    }

    // 2. Comparar la contraseña del DTO con la hasheada en la BBDD
    const isPasswordValid = bcrypt.compareSync(passwordDto, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas.'); // Contraseña incorrecta
    }

    // 3. Generar el token
    const token = this.generateToken(user);

    // 4. Quitar la contraseña del objeto antes de devolverlo
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: token,
    };
  }

  // --- HELPER PARA GENERAR TOKEN ---
  private generateToken(user: User): string {
    const payload = { 
      id: user.id, 
      email: user.email,
      roles: user.roles 
    };
    
    return jwt.sign(
      payload, 
      envs.jwtSecret, // Nuestro secreto del .env
      { expiresIn: '2h' } // El token expira en 2 horas
    );
  }
}