import Layout from "@/components/Layout";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { ReactElement } from "react";
import styles from "./style.module.scss";

const UsersTable = dynamic(import("@/components/ViewEntries/ViewEntriesUsersTable"));

const ViewEntries = ({ projectId, users }: IViewEntriesProps) => {

  if (!users.length) {
    return <h2>Currently there is no users added to this project !</h2>;
  }

  return (
    <section className={styles.wrapper}>
      <h2>Users assigned to project</h2>
      <UsersTable users={users} />
    </section>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  setContext(context);
  const projectId = Number(context.query.slug);

  try {
    const { data } = await api.get(`projects/getAssignedUsersRelatedToProject?id=${projectId}`);
    return {
      props: { projectId, users: data },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }
}

ViewEntries.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ViewEntries;
