import { api } from "@/utils/axios.instance";

type Props = {
  projects: Projects[] | undefined;
  user: USER | null;
};

const getProjects = async () => {
  try {
    const { data } = await api.get<Projects[]>("/projects/projectsByUser", {});
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};
// { projects, user }: Props
export default function Projects() {
  // console.log(projects, user);

  return (
    <ul className="menus">
      <li onClick={() => getProjects()} className="logOut">
        proj
      </li>
    </ul>
  );
}
