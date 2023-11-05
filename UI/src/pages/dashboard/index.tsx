import type { ReactElement } from "react";
import Layout from "@/components/Layout";
import Projects from "@/components/projects/project";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";

const Dashboard = ({ projects }: Props) => {
  console.log(projects);

  if (projects && projects.length === 0) {
    return <p> Currently there is no project assigned to you ! </p>;
  }

  return (
    <div>
      <Projects />
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  setContext(context);
  const { data } = await api.get("projects/projectsByUser");
  return { props: { projects: data } };
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
