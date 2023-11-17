import { api } from "@/utils/axios.instance";
import styles from "./nav.module.scss";
import { useRouter } from "next/navigation";
import Link from "next/link";

const logOutUser = async () => {
  try {
    await api.post("auth/logout");
  } catch (e) {}
};

export default function Nav() {
  const { push } = useRouter();

  const logOutUserClick = async () => {
    await logOutUser();
    push("/auth/signin");
  };

  return (
    <nav className={styles.MainNav}>
      <div className={styles.logo}>
        <Link href="/dashboard">
          <img src="/logo.svg" alt="Logo" />
        </Link>
      </div>
      <ul className={styles.menus}>
        <li className={styles.logOut} onClick={() => logOutUserClick()}>
          LogOut
        </li>
      </ul>
    </nav>
  );
}
