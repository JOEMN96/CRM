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

interface IEntries {
  id: number;
  workDescription: string;
  createdAt: Date;
  month: number;
  userId: number;
  projectID: number;
}

interface IEntriesTableProps {
  entries: IEntries[];
}
