import { UsersService } from './users.service';
import { AppDataSource } from '../config/data-source';
import { User } from './user.entity';
import { AppError } from '../utils/AppError';
import { UpdateProfileDto } from './dtos/update-profile.dto';

const mockUserRepository = AppDataSource.getRepository(User) as jest.Mocked<any>;

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    usersService = new UsersService();
  });

  it('[getProfile] debería devolver el perfil del usuario (sin contraseña)', async () => {
    const mockUser = {
      id: 'user-id-123',
      name: 'Test User',
      email: 'test@test.com',
      password: 'hashed_password',
      roles: ['CASHIER'],
    };
    mockUserRepository.findOneBy.mockResolvedValue(mockUser);

    const result = await usersService.getProfile('user-id-123');

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 'user-id-123' });
    expect(result.name).toBe('Test User');
    expect(result).not.toHaveProperty('password');
  });

  it('[getProfile] debería lanzar un error 404 si el usuario no se encuentra', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);

    await expect(usersService.getProfile('id-no-existente')).rejects.toThrow(AppError);
    await expect(usersService.getProfile('id-no-existente')).rejects.toHaveProperty('statusCode', 404);
  });

  it('[updateProfile] debería actualizar el nombre del usuario', async () => {


    const mockUser: User = {
      id: 'user-id-123',
      name: 'Nombre Antiguo',
      email: 'test@test.com',
      password: 'hashed_password',
      roles: ['CASHIER'],
      hashPassword: () => {}
    };

    const updateDto: UpdateProfileDto = { name: 'Nombre Nuevo' };
    
    mockUserRepository.findOneBy.mockResolvedValue(mockUser);
    // Simulamos que 'save' devuelve el objeto actualizado
    mockUserRepository.save.mockImplementation((user: User) => Promise.resolve(user));

    const result = await usersService.updateProfile('user-id-123', updateDto);

    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(result.name).toBe('Nombre Nuevo');
    expect(result).not.toHaveProperty('password');
  });

  it('[updateProfile] debería lanzar un error 404 si el usuario a actualizar no se encuentra', async () => {
    const updateDto: UpdateProfileDto = { name: 'Nombre Nuevo' };
    mockUserRepository.findOneBy.mockResolvedValue(null);

    await expect(usersService.updateProfile('id-no-existente', updateDto)).rejects.toThrow(AppError);
    await expect(usersService.updateProfile('id-no-existente', updateDto)).rejects.toHaveProperty('statusCode', 404);
    expect(mockUserRepository.save).not.toHaveBeenCalled(); // Verificamos que no se guardó nada
  });
});