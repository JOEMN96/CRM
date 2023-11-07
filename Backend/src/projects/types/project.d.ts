import { CreateNewProject } from '../dto';

export interface ICreateNewProject {
  name: string;
  description: string;
  owner: string;
}

export interface IAddUserToProject {
  projectName: string;
  userId: number;
}

export interface IPossibleProjectOwners {
  name: string;
  role: string;
}
