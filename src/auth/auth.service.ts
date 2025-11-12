import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../users/user.entity';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { envs } from '../config/envs';
import { AppError } from '../utils/AppError';

export class AuthService {
  private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

  public async register(registerDto: RegisterUserDto) {
    const { email } = registerDto;

    const userExists = await this.userRepository.findOneBy({ email });
    if (userExists) {
      throw new AppError('El correo electrónico ya está en uso.', 400);
    }

    const user = this.userRepository.create(registerDto);    
    const savedUser = await this.userRepository.save(user);
    const token = this.generateToken(savedUser);

    const { password, ...userWithoutPassword } = savedUser;
    
    return {
      user: userWithoutPassword,
      token: token,
    };
  }

  public async login(loginDto: LoginUserDto) {
    const { email, password: passwordDto } = loginDto;

    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new AppError('Credenciales inválidas.', 401);
    }

    const isPasswordValid = bcrypt.compareSync(passwordDto, user.password);
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas.', 401);
    }

    const token = this.generateToken(user);

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: token,
    };
  }

  private generateToken(user: User): string {
    const payload = { 
      id: user.id, 
      email: user.email,
      roles: user.roles 
    };
    
    return jwt.sign(
      payload, 
      envs.jwtSecret,
      { expiresIn: '2h' }
    );
  }
}