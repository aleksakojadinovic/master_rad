import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class EntityQueryDTO {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Transform(({ value }) => value || '')
  searchString: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : 1))
  page: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : 100))
  perPage: number;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value || [];
  })
  includes: string[] = [];
}
