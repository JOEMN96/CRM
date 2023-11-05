import { api } from "@/utils/axios.instance";
import { FloatButton } from "antd";
import { IoMdAdd } from "react-icons/io";
import styles from "./project.module.scss";
import { redirect } from "next/navigation";

// type Props = {
//   projects: Projects[] | undefined;
//   user: USER | null;
// };

// const getProjects = async () => {
//   try {
//     const { data } = await api.get<Projects[]>("/projects/projectsByUser", {});
//     console.log(data);

//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// }
// { projects, user }: Props

export default function Projects({ projects, user }: ProjectsProps) {
  if (!user || !projects) {
    redirect("/auth/signIn");
  }

  const addNewProject = () => {};

  return (
    <section>
      <p className={styles.projectsWarning}>
        {projects.length === 0 && user.role === "SUPERADMIN"
          ? "Currently theres is no Projects. Create new project by clicking the add button at the bottom right"
          : "Currently there is no project assigned to you !"}
      </p>

      {user && user.role === "SUPERADMIN" ? (
        <FloatButton
          shape="circle"
          onClick={() => addNewProject()}
          tooltip={<p>Add new project</p>}
          type="primary"
          style={{ right: 50 }}
          icon={<IoMdAdd />}
        />
      ) : (
        ""
      )}
    </section>
  );
}
