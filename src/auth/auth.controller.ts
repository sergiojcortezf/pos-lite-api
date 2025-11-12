import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthService } from './auth.service';

export class AuthController {
  private authService = new AuthService();

  public register = async (req: Request, res: Response) => {
    const registerDto = new RegisterUserDto();
    registerDto.name = req.body.name;
    registerDto.email = req.body.email;
    registerDto.password = req.body.password;

    const errors = await validate(registerDto);
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Error en la validación.', 
        errors: errors.map(e => e.constraints) 
      });
    }

    try {
      const result = await this.authService.register(registerDto);
      return res.status(201).json(result); 
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(400).json({ message: 'Un error inesperado ocurrió durante el registro.' });
    }
  }

  public login = async (req: Request, res: Response) => {
    const loginDto = new LoginUserDto();
    loginDto.email = req.body.email;
    loginDto.password = req.body.password;

    const errors = await validate(loginDto);
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Error en la validación.', 
        errors: errors.map(e => e.constraints) 
      });
    }

    try {
      const result = await this.authService.login(loginDto);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        // Ponemos 401 (Unauthorized) para errores de login
        return res.status(401).json({ message: error.message });
      }
      return res.status(401).json({ message: 'Un error inesperado ocurrió durante el login.' });
    }
  }
}