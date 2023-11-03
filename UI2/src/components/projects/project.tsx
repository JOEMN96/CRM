"use client";
import api from "@/app/utils/axios.instance";

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

export default function Projects({ projects, user }: Props) {
  // console.log(projects, user);

  return (
    <ul className="menus">
      <li onClick={() => getProjects()} className="logOut">
        proj
      </li>
    </ul>
  );
}
