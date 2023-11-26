import { type ReactElement } from "react";
import styles from "./project.module.scss";
import Layout from "@/components/Layout";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import useUser from "@/utils/useUser";

const Calender = dynamic(import("@/components/Calender"), { ssr: false });

const Project = ({ calenderData, page }: IProjectPageProps) => {
  let user = useUser();

  return (
    <>
      {user?.role !== "USER" && (
        <section className={styles.adminDetailsWrapper}>
          <Link href={`/viewEntries/${page}`}>View Details</Link>
        </section>
      )}

      <Calender entries={calenderData.entries} config={calenderData.config} />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  setContext(context);
  const page = Number(context.query.slug);
  try {
    const { data } = await api.get("calender/getEntries", {
      data: { month: 11, projectId: page } as IGetEntriesGet,
    });
    return {
      props: {
        calenderData: data,
        page,
      },
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

Project.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Project;
