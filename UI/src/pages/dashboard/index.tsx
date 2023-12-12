import { type ReactElement } from "react";
import Layout from "@/components/Layout";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import useUser from "@/utils/useUser";
import Link from "next/link";

const Projects = dynamic(import("@/components/projects/Project"), { ssr: false });

const Dashboard = ({ projects }: Props) => {
  let user = useUser();

  return (
    <>
      <Projects projects={projects} />

      {user?.role !== "USER" ? (
        <div>
          View All Users : <Link href="/users"> Here </Link>
        </div>
      ) : (
        ""
      )}
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
