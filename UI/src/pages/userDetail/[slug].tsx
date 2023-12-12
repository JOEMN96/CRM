import Layout from "@/components/Layout";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import { ReactElement } from "react";
import styles from "./userDetail.module.scss";
import { Avatar, Badge, message } from "antd";
import { FaRegFilePdf, FaFileWord } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/router";

const ViewEntries = ({ user, docs }: IUserDetailProps) => {
  const baseURL = process.env.BASEURL;
  const router = useRouter();

  const handleDocDelete = async (path: string, userId: number) => {
    const res = await api.delete(`users/docs/delete?path=${path}&id=${userId}`);
    if (res.status === 200) {
      message.success(`File is deleted sucessfully`);
      router.replace(router.asPath);
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.avatarWrapper}>
        <Avatar size={64} src={user.profile.profilePicFilePath ? baseURL + user.profile.profilePicFilePath : ""} />
        <Badge
          style={{ top: "-10px", backgroundColor: "#52c41a" }}
          count={user.active ? "Account Is Active" : "Account Is Not Active"}
        >
          <h2>{user.name}</h2>
        </Badge>
      </div>
      <h2>EMAIL : {user.email}</h2>
      <h2>ROLE: {user.role}</h2>

      <div className={styles.docsWrap}>
        <h2>Uploaded Documents: </h2>
        <div>
          {docs.length < 1 ? <p>No documents Found</p> : ""}
          {docs.map((doc) => {
            return (
              <div className={styles.doc} key={doc.id}>
                {doc.type === "application/pdf" ? <FaRegFilePdf /> : <FaFileWord />} <br />
                <div className={styles.linkWrap}>
                  <Link target="_blank" href={`${baseURL}users/view/docs?path=${doc.path}&id=${user.id}`}>
                    {doc.documentName}
                  </Link>
                  <MdDelete className={styles.delete} onClick={() => handleDocDelete(doc.path, user.id)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  setContext(context);
  const userID = Number(context.query.slug);
  try {
    const user = await api.get("users/" + userID);
    const docs = await api.get("users/docs/" + userID);
    return {
      props: { user: user.data, docs: docs.data },
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
