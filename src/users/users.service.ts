import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { User } from './user.entity';
import { UpdateProfileDto } from './dtos/update-profile.dto';

export class UsersService {
  private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

  public async getProfile(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async updateProfile(userId: string, updateDto: UpdateProfileDto) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    Object.assign(user, updateDto);

    await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}