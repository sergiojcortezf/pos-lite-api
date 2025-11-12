import { AuthService } from './auth.service';
import { AppDataSource } from '../config/data-source';
import { User } from '../users/user.entity';
import bcrypt from 'bcryptjs';

const mockUserRepository = AppDataSource.getRepository(User) as jest.Mocked<any>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });

  // --- Prueba de Login ---
  it('debería loguear a un usuario con credenciales correctas', async () => {
    const loginDto = { email: 'test@test.com', password: 'password123' };
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      password: 'hashed_password123',
      roles: ['CASHIER'],
    };

    mockUserRepository.findOneBy.mockResolvedValue(mockUser);

    const result = await authService.login(loginDto);

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(result.token).toBe('mocked_jwt_token');
    expect(result.user).not.toHaveProperty('password')
  });

  // --- Prueba de Registro ---
  it('debería registrar un nuevo usuario', async () => {
    // 1. Preparación
    const registerDto = { name: 'Test User', email: 'new@test.com', password: 'password123' };

    const savedUserMock = {
      id: 'un-id-falso-de-prueba',
      ...registerDto,
      roles: ['CASHIER']
    };
    
    mockUserRepository.findOneBy.mockResolvedValue(null);
    mockUserRepository.create.mockReturnValue(registerDto);
    mockUserRepository.save.mockResolvedValue(savedUserMock);

    const result = await authService.register(registerDto);

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: 'new@test.com' });
    expect(mockUserRepository.create).toHaveBeenCalledWith(registerDto);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(result.token).toBe('mocked_jwt_token');

    expect(result.user).not.toHaveProperty('password');
  });
});