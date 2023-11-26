interface IViewEntriesProps {
  projectId: number;
  users: User[];
}

type User = {
  id: number;
  email: string;
  name: string;
  role: $Enums.Role;
  active: boolean;
};
