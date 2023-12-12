interface IUserDetailProps {
  user: IUserWithProfile;
  docs: IDocs[];
}

interface IDocs {
  documentName: string;
  id: number;
  path: string;
  type: string;
  userId: number;
}
