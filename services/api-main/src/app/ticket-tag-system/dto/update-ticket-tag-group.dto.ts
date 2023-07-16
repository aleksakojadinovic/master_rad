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
import { CreateTicketTagDTO } from './create-ticket-tag.dto';

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

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayUnique()
  @Validate(IsValidObjectId, { each: true })
  @Transform(({ value }) => (value !== undefined ? value : null))
  public canSeeRoles?: string[] | null;
}

export class UpdateTicketTagGroupTagsDTO {
  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayUnique()
  @Validate(IsValidObjectId, { each: true })
  @Transform(({ value }) => (value !== undefined ? value : null))
  public removeIds?: string[] | null;

  @Expose()
  @IsArray()
  @IsOptional()
  @Type(() => CreateTicketTagDTO)
  @ValidateNested()
  @Transform(({ value }) => (value !== undefined ? value : null))
  public addOrUpdateTags?: CreateTicketTagDTO[] | null;
}

export class CreateOrUpdateTicketTagGroupDTO {
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

  @Expose()
  @IsOptional()
  @Type(() => UpdateTicketTagGroupTagsDTO)
  @ValidateNested()
  @Transform(({ value }) => (value !== undefined ? value : null))
  public tags?: UpdateTicketTagGroupTagsDTO | null;
}
