import { useState } from "react";
import { FloatButton } from "antd";
import { IoMdAdd } from "react-icons/io";
import styles from "./project.module.scss";
import useUser from "@/utils/useUser";
import { useRouter } from "next/router";
import ProjectCard from "./ProjectCard/ProjectCard";
import Link from "next/link";
import dynamic from "next/dynamic";

const ProjectForm = dynamic(import("./ProjectForm/ProjectForm"), { ssr: false });

export default function Projects({ projects }: ProjectsProps) {
  const router = useRouter();
  const user = useUser();
  const [open, setOpen] = useState(false);

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
              <Link href={`project/${project.id}`} key={project.id}>
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  createdAt={project.createdAt}
                  description={project.description}
                  owner={project.owner}
                  user={user?.role}
                  projectId={project.id}
                />
              </Link>
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
          {open && <ProjectForm open={open} onClose={onClose} />}
        </>
      ) : (
        ""
      )}
    </section>
  );
}
