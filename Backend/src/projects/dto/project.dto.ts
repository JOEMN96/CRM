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
  @IsNumber()
  projectId: number;

  addedusers: number[];
}

export class DeleteProjectByName {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class getAssignedUsers {
  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
