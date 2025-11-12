import { IsString, IsEmail, MinLength } from 'class-validator';


export class RegisterUserDto {

  @IsString({ message: 'El nombre debe ser un texto.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  name!: string;

  @IsEmail({}, { message: 'El formato del email no es válido.' })
  email!: string;

  @IsString({ message: 'La contraseña debe ser un texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password!: string;
  
}