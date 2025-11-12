import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';


export class RegisterUserDto {

  @IsString({ message: 'El nombre debe ser un texto.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(30, { message: 'El nombre no puede exceder los 30 caracteres.' })
  name!: string;

  @IsEmail({}, { message: 'El formato del email no es válido.' })
  @MaxLength(40, { message: 'El email no puede exceder los 40 caracteres.' })
  email!: string;

  @IsString({ message: 'La contraseña debe ser un texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(100, { message: 'La contraseña no puede exceder los 100 caracteres.' })
  password!: string;
  
}