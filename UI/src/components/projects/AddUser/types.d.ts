interface AddUserProps {
  setOpen: (a: boolean) => void;
  open: boolean;
}

interface IUsers {
  active: boolean;
  email: string;
  id: number;
  name: string;
  role: string;
  selected?: boolean;
}
