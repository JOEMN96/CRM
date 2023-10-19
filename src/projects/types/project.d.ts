import { CreateNewProject } from '../dto';

export interface ICreateNewProject {
  name: string;
  description: string;
  owner: string;
}

export type DeleteProjectByName = Omit<
  CreateNewProject,
  'description' | 'owner'
>;

export interface IAddUserToProject {
  projectName: string;
  userId: number;
}
