import { api } from "@/utils/axios.instance";
import styles from "./nav.module.scss";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useUser from "@/utils/useUser";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "@/store/slices/profileSlice";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { RootState } from "@/store/store";
import { IoIosNotifications } from "react-icons/io";

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
  const profile = useSelector((state: RootState) => state.profile.profile.profilePicFilePath);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  let user = useUser();

  const logOutUserClick = async () => {
    await logOutUser();
    push("/auth/signin");
  };

  const getInitialNotifications = async () => {
    let { data } = await api.get("notification");
    setNotifications(data as INotification[]);
  };

  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
  };

  let ref = useRef<any>();

  useEffect(() => {
    dispatch(fetchProfile());
    getInitialNotifications();

    const handler = (event: MouseEvent | TouchEvent) => {
      // console.log(ref);

      if (showNotification && ref.current && !ref.current.contains(event.target)) {
        setShowNotification(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
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
        <li className={styles.notification}>
          <IoIosNotifications onClick={handleNotificationClick} />
          <div ref={ref} className={styles.notificationContainer + (showNotification ? ` ${styles.active}` : "")}>
            {showNotification &&
              notifications.map((notification) => (
                <div className={styles.notificationItem}>
                  <p key={notification.id}>{notification.message}</p>
                </div>
              ))}
          </div>
        </li>
        <li>
          <Link href="/Profile">
            <Avatar icon={<UserOutlined />} src={profile ? (process.env.BASEURL as string) + profile : null} />
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
