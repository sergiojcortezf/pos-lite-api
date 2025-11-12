import { IsString, IsNumber, Min, MinLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {

  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @MinLength(8)
  @IsOptional()
  barcode?: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  category?: string;
}