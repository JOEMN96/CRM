import { useState } from "react";
import { FloatButton } from "antd";
import { IoMdAdd } from "react-icons/io";
import styles from "./project.module.scss";
import useUser from "@/utils/useUser";
import { useRouter } from "next/router";
import ProjectForm from "./ProjectForm/ProjectForm";
import ProjectCard from "./ProjectCard/ProjectCard";

export default function Projects({ projects }: ProjectsProps) {
  const router = useRouter();
  const user = useUser();
  const [open, setOpen] = useState(false);
  console.log(projects);

  if (!user) {
    router.push("/auth/signin");
  }

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <section>
      <p className={styles.projectsWarning}>
        {projects && user && projects.length === 0 && user.role === "SUPERADMIN"
          ? "Currently theres is no Projects. Create new project by clicking the add button at the bottom right"
          : ""}
      </p>

      <p>
        {projects && projects.length === 0 && user?.role !== "SUPERADMIN" ? "Currently there is no projects assigned to you" : ""}
      </p>

      <div className={styles.projectCardWrapper}>
        {projects && projects.length !== 0
          ? projects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                createdAt={project.createdAt}
                description={project.description}
                owner={project.owner}
                user={user?.role}
              />
            ))
          : ""}
      </div>

      {user && user.role === "SUPERADMIN" ? (
        <>
          <FloatButton
            shape="circle"
            onClick={() => showDrawer()}
            tooltip={<p>Add new project</p>}
            type="primary"
            style={{ right: 50 }}
            icon={<IoMdAdd />}
          />
          <ProjectForm open={open} onClose={onClose} />
        </>
      ) : (
        ""
      )}
    </section>
  );
}
