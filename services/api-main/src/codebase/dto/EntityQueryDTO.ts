import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class EntityQueryDTO {
  // TODO: Maybe pagination
  constructor(
    public searchString: string = '',
    public includes: string[] | null = null,
    public sortBy: string = null,
    public page: number | null,
    public perPage: number | null,
    public filters: any = {},
  ) {}
}

export class EntityQueryDTONew {
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
