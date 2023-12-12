interface IUsersProps {
  users: IUserWithProfile[];
}

interface IUserWithProfile extends User {
  profile: {
    profilePicFilePath: string;
  };
}
