interface AddUserProps {
  setOpen: (a: boolean) => void;
  open: boolean;
  projectId: number;
}

interface IUsers {
  active: boolean;
  email: string;
  id: number;
  name: string;
  role: string;
  selected?: boolean;
  modified?: boolean;
}
