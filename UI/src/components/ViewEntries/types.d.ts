interface EntriesUsersProps {
  users: EntriesUser[];
}

type EntriesUser = {
  active: boolean;
  email: string;
  id: number;
  name: string;
  role: string;
};
