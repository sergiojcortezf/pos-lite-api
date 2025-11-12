import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';

export class UsersController {
  private usersService = new UsersService();

  public getProfile = async (req: Request, res: Response) => {
    const userId = req.user!.id; 
    const user = await this.usersService.getProfile(userId);
    return res.status(200).json(user);
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

    const updatedUser = await this.usersService.updateProfile(userId, updateDto);
    return res.status(200).json(updatedUser);
  }
}