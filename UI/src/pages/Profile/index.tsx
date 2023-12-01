import { type ReactElement } from "react";
import Layout from "@/components/Layout";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

const Calender = dynamic(import("@/components/Calender"), { ssr: false });

const Profile = () => {
  return <h1>Profile</h1>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  setContext(context);
  return {
    props: {},
  };
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Profile;
