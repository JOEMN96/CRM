import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateNewUser {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  role: 'ADMIN' | 'SUPERADMIN' | 'USER';
}
