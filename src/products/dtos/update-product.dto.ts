import { IsString, IsNumber, Min, MinLength, IsOptional, MaxLength, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(9999)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(1000)
  @IsOptional()
  stock?: number;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @IsOptional()
  barcode?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  category?: string;
}