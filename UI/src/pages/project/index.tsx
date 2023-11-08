import { type ReactElement } from "react";
import Layout from "@/components/Layout";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import styles from "./projectPage.module.scss";
const Calender = dynamic(import("@/components/Calender"), { ssr: false });

const Project = () => {
  return (
    <>
      <Calender />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  setContext(context);
  //   const res = await api.get("projects/projectsByUser");
  return { props: { data: "Test" } };
}

Project.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Project;
