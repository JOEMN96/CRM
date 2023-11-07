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
}

interface IProjectOwners {
  name: string;
  role: string;
}

interface IProjectCard {
  name: string;
  description: string;
  owner: string;
  createdAt: Date;
  user: string | undefined;
}
