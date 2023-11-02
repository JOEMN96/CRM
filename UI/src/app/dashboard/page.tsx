import Projects from "../components/projects/project";
import api from "../utils/axios.instance";
import useUser from "../utils/useUser";
import { redirect } from "next/navigation";

const getProjects = async () => {
  try {
    const { data } = await api.get<Projects[]>("/projects/projectsByUser", {});
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default async function Dashboard() {
  const user = useUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const projects = await getProjects();

  return (
    <main>
      <Projects projects={projects} user={user} />
    </main>
  );
}
