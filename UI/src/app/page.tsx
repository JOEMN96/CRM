import Test from "./components/test";
import styles from "./page.module.css";
import useUser from "./utils/useUser";
import { redirect } from "next/navigation";

export default async function Home() {
  if (!useUser()) {
    redirect("/signin");
  }

  return <h2>Dashboard</h2>;
}
