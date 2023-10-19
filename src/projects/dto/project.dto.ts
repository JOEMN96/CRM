import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNewProject {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  owner: string;
}

export class AddUserToProject {
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
