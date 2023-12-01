import { api } from "@/utils/axios.instance";
import styles from "./nav.module.scss";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useUser from "@/utils/useUser";

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

  let user = useUser();

  const logOutUserClick = async () => {
    await logOutUser();
    push("/auth/signin");
  };
  // connectSseNotification();

  return (
    <nav className={styles.MainNav}>
      <div className={styles.logo}>
        <Link href="/dashboard">
          <img src="/logo.svg" alt="Logo" />
        </Link>
      </div>
      <ul className={styles.menus}>
        <li suppressHydrationWarning>{user?.email.split("@")[0]}</li>
        <li>
          <Link href="/Profile">Profile</Link>
        </li>
        <li className={styles.logOut} onClick={() => logOutUserClick()}>
          LogOut
        </li>
      </ul>
    </nav>
  );
}
