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
  const profile = useSelector((state: RootState) => state.profile.profile);
  const baseURL = process.env.BASEURL as string;

  return (
    <div className={styles.profileWrapper}>
      <Avatar
        shape="square"
        size={64}
        icon={<UserOutlined />}
        src={profile.profilePicFilePath ? baseURL + profile.profilePicFilePath : null}
      />
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
