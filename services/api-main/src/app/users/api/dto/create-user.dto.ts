import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(8, {
    message: 'Username is too short, minimum length is 8 characters.',
  })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  @IsString()
  @MinLength(8, {
    message: 'Password is too short, minimum length is 8 characters.',
  })
  password: string;
}
