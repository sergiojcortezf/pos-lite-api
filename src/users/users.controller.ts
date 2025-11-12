import { Request, Response } from 'express';
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

    const updateDto = req.body as UpdateProfileDto;

    const updatedUser = await this.usersService.updateProfile(userId, updateDto);
    return res.status(200).json(updatedUser);
  }
}