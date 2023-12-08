import { api } from "@/utils/axios.instance";
import styles from "./nav.module.scss";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useUser from "@/utils/useUser";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfileInit } from "@/store/slices/profileSlice";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const connectSseNotification = () => {
  if (typeof window !== "undefined") {
    const eventSource = new EventSource("http://localhost:3001/users/notification/sse", { withCredentials: true });
    eventSource.onmessage = ({ data }) => {
      console.log("New message", JSON.parse(data));
    };
  }
};

const logOutUser = async () => {
  try {
    await api.post("auth/logout");
  } catch (e) {}
};

export default function Nav() {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const [profilePic, setProfilePic] = useState("");

  let user = useUser();

  const logOutUserClick = async () => {
    await logOutUser();
    push("/auth/signin");
  };

  useEffect(() => {
    const getProfile = async () => {
      let res = await api.get("/profile");
      dispatch(updateProfileInit(res.data));
      if (res.data?.profile?.profilePicFilePath) {
        setProfilePic(res.data.profile.profilePicFilePath);
      }
    };
    getProfile();
  }, []);
  // connectSseNotification();

  return (
    <nav className={styles.MainNav}>
      <div className={styles.logo}>
        <Link href="/dashboard">
          <img src="/logo.svg" alt="Logo" />
        </Link>
      </div>
      <ul className={styles.menus}>
        <li>
          <Link href="/Profile">
            <Avatar icon={<UserOutlined />} src={profilePic ? process.env.BASEURL + profilePic : null} />
          </Link>
        </li>
        <li suppressHydrationWarning>{user?.email.split("@")[0]}</li>
        <li className={styles.logOut} onClick={() => logOutUserClick()}>
          LogOut
        </li>
      </ul>
    </nav>
  );
}
