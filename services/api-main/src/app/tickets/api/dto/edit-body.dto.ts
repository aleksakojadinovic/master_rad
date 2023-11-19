import { IsString, MinLength } from 'class-validator';

export class EditBodyDTO {
  @IsString()
  @MinLength(20)
  body: string;
}
