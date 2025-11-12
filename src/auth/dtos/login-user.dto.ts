import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';


export class LoginUserDto {

  @IsEmail({}, { message: 'El formato del email no es válido.' })
  @MaxLength(40, { message: 'El email no puede exceder los 40 caracteres.' })
  email!: string;

  @IsString({ message: 'La contraseña debe ser un texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(100, { message: 'La contraseña no puede exceder los 100 caracteres.' })
  password!: string;
}