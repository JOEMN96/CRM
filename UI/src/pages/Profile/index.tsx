import { type ReactElement } from "react";
import Layout from "@/components/Layout";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./profile.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Profile = () => {
  const post = useSelector((state: RootState) => state.profile);
  console.log(post);

  return (
    <div className={styles.profileWrapper}>
      <Avatar shape="square" size={64} icon={<UserOutlined />} />
    </div>
  );
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
