interface ISignUp {
  email: string;
  password: string;
}

interface IServerErrors {
  message?: string;
  validationErrors?: string[];
}
