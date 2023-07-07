import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsValidObjectId } from 'src/codebase/pipes/objectid-pipe';
import { IntlValue } from 'src/codebase/types/IntlValue';

export class UpdateTicketTagGroupPermissionsDTO {
  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayUnique()
  @Validate(IsValidObjectId, { each: true })
  @Transform(({ value }) => (value !== undefined ? value : null))
  public canAddRoles?: string[] | null;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayUnique()
  @Validate(IsValidObjectId, { each: true })
  @Transform(({ value }) => (value !== undefined ? value : null))
  public canRemoveRoles?: string[] | null;
}

export class UpdateTicketTagGroupDTO {
  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? value : null))
  public nameIntl?: IntlValue | null;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? value : null))
  public descriptionIntl?: IntlValue | null;

  @Expose()
  @IsOptional()
  @Type(() => UpdateTicketTagGroupPermissionsDTO)
  @ValidateNested()
  @Transform(({ value }) => (value !== undefined ? value : null))
  public permissions?: UpdateTicketTagGroupPermissionsDTO | null;
}
