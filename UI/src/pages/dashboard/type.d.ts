type Props = {
  projects: Projects[] | undefined;
  user: USER | null;
};

type Projects = {
  id: number;
  name: string;
  description: string;
  owner: string;
  userId: number;
  createdAt: Date;
};
