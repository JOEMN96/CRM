import useUser from "../utils/useUser";
import { redirect } from "next/navigation";

export default async function Home() {
  if (!useUser()) {
    redirect("/auth/signin");
  }

  return <h2>Dashboard</h2>;
}
