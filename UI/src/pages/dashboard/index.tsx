import type { ReactElement } from "react";
import Layout from "@/components/Layout";
import Projects from "@/components/projects/project";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import useUser from "@/utils/useUser";

const Dashboard = ({ projects, user }: Props) => {
  return (
    <>
      <Projects projects={projects} user={user} />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  setContext(context);
  const user = useUser(context.req.cookies.access_token);

  const { data } = await api.get("projects/projectsByUser");
  return { props: { projects: data, user } };
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
