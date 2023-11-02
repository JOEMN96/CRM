"use client";
import api from "@/app/utils/axios.instance";

type Props = {
  projects: Projects[] | undefined;
  user: USER | null;
};

export default function Projects({ projects, user }: Props) {
  console.log(projects, user);

  return (
    <ul className="menus">
      <li className="logOut">proj</li>
    </ul>
  );
}
