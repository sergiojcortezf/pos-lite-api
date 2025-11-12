import { IsString, IsNumber, Min, MinLength, MaxLength, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name!: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(9999)
  price!: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(1000)
  stock!: number;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  barcode!: string; 

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  category?: string;
}