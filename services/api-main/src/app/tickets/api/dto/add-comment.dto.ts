import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class AddCommentDTO {
  @IsNotEmpty()
  @MinLength(2)
  body: string;

  @IsOptional()
  isInternal?: boolean;
}
