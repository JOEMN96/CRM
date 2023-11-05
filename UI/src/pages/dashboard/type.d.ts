type Props = {
  projects: Projects[] | undefined;
};

type Projects = {
  id: number;
  name: string;
  description: string;
  owner: string;
  userId: number;
  createdAt: Date;
};
