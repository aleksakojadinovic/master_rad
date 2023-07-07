import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsValidObjectId } from 'src/codebase/pipes/objectid-pipe';
import { IntlValue } from 'src/codebase/types/IntlValue';

// export class UpdateTicketTagGroupDTO {
//   @Expose()
//   @Transform((params) => {
//     // console.log('transforming', value);
//     console.log('transforming', { params });
//     console.log('-----');
//     return 5;
//   })
//   public nameIntl?: IntlValue | null;

//   @Expose()
//   @Transform((value: any) => value.descriptionIntl ?? null)
//   public descriptionIntl?: IntlValue | null;

//   @Expose()
//   @Transform((value: any) => value.permissions ?? null)
//   public permissions?: any | null;
// }

export class UpdateTicketTagGroupPermissionsDTO {
  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Validate(IsValidObjectId, { each: true })
  @Transform(({ value }) => (value !== undefined ? value : null))
  public canAddRoles?: string[] | null;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
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
