import { IsString, MinLength, IsOptional, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(30, { message: 'El nombre no puede exceder los 30 caracteres.' })
  @IsOptional()
  name?: string;

  // Nota: No incluimos 'email' o 'password'.
  // Esas son operaciones más sensibles que deberían ir
  // en endpoints separados (ej. /change-password),
  // que están fuera del alcance de este MVP.
}