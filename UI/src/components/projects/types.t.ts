type ProjectsProps = {
  projects: Projects[] | undefined;
};

type ProjectForm = {
  open: boolean;
  onClose: () => void;
};

interface IProjectFormValues {
  name: string;
  description: string;
  owner: string;
  id: number;
}

interface IProjectOwners {
  name: string;
  role: string;
  id: number;
}

interface IProjectCard {
  name: string;
  description: string;
  owner: string;
  createdAt: Date;
  user: string | undefined;
  projectId: number;
}
