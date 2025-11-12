import { AuthService } from './auth.service';
import { AppDataSource } from '../config/data-source';
import { User } from '../users/user.entity';
import { AppError } from '../utils/AppError';

const mockUserRepository = AppDataSource.getRepository(User) as jest.Mocked<any>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });

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
    expect(result.user).not.toHaveProperty('password');
  });

  it('debería registrar un nuevo usuario', async () => {
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
    expect(result.token).toBe('mocked_jwt_token');
    expect(result.user).not.toHaveProperty('password');
  });

  it('debería lanzar un error 401 al loguear con contraseña incorrecta', async () => {
    const loginDto = { email: 'test@test.com', password: 'wrong_password' };
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      password: 'hashed_password123',
      roles: ['CASHIER'],
    };
    mockUserRepository.findOneBy.mockResolvedValue(mockUser);

    await expect(authService.login(loginDto)).rejects.toThrow(AppError);
    await expect(authService.login(loginDto)).rejects.toHaveProperty('statusCode', 401);
  });

  it('debería lanzar un error 400 al registrar con un email duplicado', async () => {
    const registerDto = { name: 'Test User', email: 'existing@test.com', password: 'password123' };
    const mockUser = { id: '1', email: 'existing@test.com', password: 'hashed_password123' };

    mockUserRepository.findOneBy.mockResolvedValue(mockUser);

    await expect(authService.register(registerDto)).rejects.toThrow(AppError);
    await expect(authService.register(registerDto)).rejects.toHaveProperty('statusCode', 400);
  });
});