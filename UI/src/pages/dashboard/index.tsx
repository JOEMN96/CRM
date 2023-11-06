import { use, type ReactElement } from "react";
import Layout from "@/components/Layout";
// import Projects from "@/components/projects/Project";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

const Projects = dynamic(import("@/components/projects/Project"), { ssr: false });

const Dashboard = ({ projects }: Props) => {
  return (
    <>
      <Projects projects={projects} />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  setContext(context);
  const res = await api.get("projects/projectsByUser");
  return { props: { projects: res.data } };
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;