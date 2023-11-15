import { useEffect, type ReactElement } from "react";
import Layout from "@/components/Layout";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import styles from "./projectPage.module.scss";

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
  const { data } = await api.get("calender/getEntries", { data: { month: 11, projectId: 1 } as IGetEntriesGet });
  return { props: data };
}

Project.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Project;
