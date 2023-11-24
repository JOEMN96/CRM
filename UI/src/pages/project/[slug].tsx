import { type ReactElement } from "react";
import Layout from "@/components/Layout";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

const Calender = dynamic(import("@/components/Calender"), { ssr: false });

const Project = (calenderData: ICalenderData) => {
  return (
    <>
      <Calender entries={calenderData.entries} config={calenderData.config} />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  setContext(context);

  try {
    const { data } = await api.get("calender/getEntries", {
      data: { month: 11, projectId: Number(context.query.slug) } as IGetEntriesGet,
    });
    return { props: data };
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
