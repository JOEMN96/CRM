interface IValues {
  name: string;
  email: string;
  password: string;
}

interface Ierrors {
  Taken?: "Email already taken";
  validationErrors?: string[];
}
