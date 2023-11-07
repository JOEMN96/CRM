import { api } from "@/utils/axios.instance";
import style from "./projectCard.module.scss";
import moment from "moment";
import { AiFillDelete } from "react-icons/ai";
import { notification } from "antd";
import { useRouter } from "next/router";

export default function ProjectCard({
  name,
  description,
  owner,
  createdAt,
  user,
}: IProjectCard) {
  const router = useRouter();
  const formattedDate = moment(createdAt).format("d-mm-YYYY");

  const handleDelete = async function (name: string) {
    try {
      await api.delete("/projects", { data: { name } });
      router.replace(router.asPath);
    } catch (error: any) {
      console.log(error);
      notification.open({ message: error?.response?.message, type: "error" });
    }
  };
  return (
    <div className={style.card}>
      <p className="name"> Project Name: {name}</p>
      <p className="desc">Description: {description}</p>
      <p className="owner">Owner: {owner}</p>
      <p className="time">Created: {formattedDate}</p>

      {user && user === "SUPERADMIN" ? (
        <AiFillDelete
          onClick={() => handleDelete(name)}
          className={style.delete}
        />
      ) : (
        ""
      )}
    </div>
  );
}
