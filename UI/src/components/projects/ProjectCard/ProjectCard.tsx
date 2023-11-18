import { api } from "@/utils/axios.instance";
import style from "./projectCard.module.scss";
import moment from "moment";
import { AiFillDelete } from "react-icons/ai";
import { notification } from "antd";
import { useRouter } from "next/router";
import { Button, Popconfirm } from "antd";

export default function ProjectCard({ name, description, owner, createdAt, user }: IProjectCard) {
  const router = useRouter();
  const formattedDate = moment(createdAt).format("d-mm-YYYY");

  const handleDelete = async function (name: string) {
    try {
      await api.delete("/projects", { data: { name } });
      router.replace(router.asPath);
    } catch (error: any) {
      notification.open({ message: error?.response?.message, type: "error" });
    }
  };

  const confirm = (e: React.MouseEvent<HTMLElement> | undefined): Boolean => {
    if (e) {
      e.stopPropagation();
    }
    handleDelete(name);
    return false;
  };

  const cancel = (e?: React.MouseEvent<HTMLElement | undefined>) => {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  return (
    <div className={style.card}>
      <p className="name"> Project Name: {name}</p>
      <p className="desc">Description: {description}</p>
      <p className="owner">Owner: {owner}</p>
      <p className="time">Created: {formattedDate}</p>

      {user && user === "SUPERADMIN" ? (
        <Popconfirm
          title="Delete the Project"
          description="Are you sure to delete this task? This will remove all data permenently"
          onConfirm={confirm}
          onCancel={cancel}
          okText="Yes"
          overlayInnerStyle={{ margin: "0 10px" }}
        >
          <Button>
            <AiFillDelete onClick={(e: React.MouseEvent<HTMLElement>) => e.preventDefault()} className={style.delete} />
          </Button>
        </Popconfirm>
      ) : (
        ""
      )}
    </div>
  );
}
