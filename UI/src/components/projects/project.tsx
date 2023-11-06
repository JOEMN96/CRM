import { api } from "@/utils/axios.instance";
import { FloatButton } from "antd";
import { IoMdAdd } from "react-icons/io";
import styles from "./project.module.scss";
import useUser from "@/utils/useUser";
import { useRouter } from "next/router";

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

export default function Projects({ projects }: ProjectsProps) {
  const addNewProject = () => {};
  const router = useRouter();

  const user = useUser();

  if (!user) {
    router.push("/auth/signin");
  }

  return (
    <section>
      <p className={styles.projectsWarning}>
        {projects && user && projects.length === 0 && user.role === "SUPERADMIN"
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
