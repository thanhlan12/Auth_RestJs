import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { UserRole } from 'src/auth/roles/user.roles';

export class CreateUserDto {
  @MaxLength(40, {
    message: 'Name is required and can not exceed 40 characters limit.',
  })
  name: string;

  @IsEmail()
  @MaxLength(255, {
    message: 'Email is required and can not exceed 255 characters limit.',
  })
  email: string;


  @MinLength(8, { message: 'Password needs to be 8 characters minimum.' })
  @MaxLength(20, {
    message: 'Password is required and can not exceed 20 characters limit.',
  })
  password: string;

  role?: UserRole;
}
