import { Request, Response } from 'express';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthService } from './auth.service';

export class AuthController {
  private authService = new AuthService();

  public register = async (req: Request, res: Response) => {
    const registerDto = req.body as RegisterUserDto;

    const result = await this.authService.register(registerDto);
    return res.status(201).json(result);
  }

  public login = async (req: Request, res: Response) => {
    const loginDto = req.body as LoginUserDto;

    const result = await this.authService.login(loginDto);
    return res.status(200).json(result);
  }
}