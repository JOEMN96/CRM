import Layout from "@/components/Layout";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import { ReactElement } from "react";
import styles from "./users.module.scss";
import { Avatar, Card, Col, Row } from "antd";
import Link from "next/link";

const ViewEntries = ({ users }: IUsersProps) => {
  const baseURL = process.env.BASEURL;

  return (
    <section className={styles.wrapper}>
      <Row gutter={12}>
        {users.map((user) => {
          return (
            <Col span={8} key={user.id}>
              <Link href={"/userDetail/" + user.id}>
                <Card
                  className={(styles.cardWrap, user.active == false ? "userNotActive" : "")}
                  hoverable={true}
                  title={user.name}
                  bordered={false}
                >
                  <Avatar size={64} src={user.profile.profilePicFilePath ? baseURL + user.profile.profilePicFilePath : ""} />
                  <h3>{user.email}</h3>
                  <h3>Role: {user.role}</h3>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
    </section>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  setContext(context);

  try {
    const { data } = await api.get("users");
    return {
      props: { users: data },
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

ViewEntries.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ViewEntries;
