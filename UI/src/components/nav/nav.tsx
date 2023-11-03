"use client";
import axiosInstance from "@/app/utils/axios.instance";
import "./nav.scss";
import { useRouter } from "next/navigation";

const logOutUser = async () => {
  try {
    await axiosInstance.post("auth/logout");
  } catch (e) {}
};

export default function Nav() {
  const { push } = useRouter();

  const logOutUserClick = async () => {
    await logOutUser();
    push("/auth/signin");
  };

  return (
    <nav>
      <div className="logo">
        <img src="/logo.svg" alt="Logo" />
      </div>
      <ul className="menus">
        <li className="logOut" onClick={() => logOutUserClick()}>
          LogOut
        </li>
      </ul>
    </nav>
  );
}
