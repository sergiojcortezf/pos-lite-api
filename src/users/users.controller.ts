import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';

export class UsersController {
  private usersService = new UsersService();

  public getProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const user = await this.usersService.getProfile(userId);
      return res.status(200).json(user);

    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }

  public updateProfile = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const updateDto = new UpdateProfileDto();
    updateDto.name = req.body.name;

    const errors = await validate(updateDto);
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Error en la validación.', 
        errors: errors.map(e => e.constraints) 
      });
    }

    try {
      const updatedUser = await this.usersService.updateProfile(userId, updateDto);
      return res.status(200).json(updatedUser);

    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}