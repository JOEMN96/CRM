import { api } from "@/utils/axios.instance";
import styles from "./nav.module.scss";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useUser from "@/utils/useUser";

const logOutUser = async () => {
  try {
    await api.post("auth/logout");
  } catch (e) {}
};

export default function Nav() {
  const { push } = useRouter();

  let user = useUser();
  console.log(user);

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
        <li>{user?.email}</li>
        <li className={styles.logOut} onClick={() => logOutUserClick()}>
          LogOut
        </li>
      </ul>
    </nav>
  );
}
