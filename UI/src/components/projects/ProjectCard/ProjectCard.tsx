import { useState } from "react";
import { api } from "@/utils/axios.instance";
import style from "./projectCard.module.scss";
import moment from "moment";
import { AiFillDelete } from "react-icons/ai";
import { notification } from "antd";
import { useRouter } from "next/router";
import { Button, Popconfirm, Popover } from "antd";
import { IoPersonAdd } from "react-icons/io5";
import dynamic from "next/dynamic";

const AddUser = dynamic(import("../AddUser/AddUser"), { ssr: false });

export default function ProjectCard({ name, description, owner, createdAt, user, projectId }: IProjectCard) {
  const [open, setOpen] = useState(false);
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
    }
  };

  const openAddUserPopup = (e: React.MouseEvent<HTMLElement | undefined>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <div className={style.card}>
      <p className="name"> Project Name: {name}</p>
      <p className="desc">Description: {description}</p>
      <p className="owner">Owner: {owner}</p>
      <p className="time">Created: {formattedDate}</p>

      {user && user === "SUPERADMIN" ? (
        <div className={style.adminArea} onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}>
          <Popconfirm
            title="Delete the Project"
            description="Are you sure to delete this task? This will remove all data permenently"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            overlayInnerStyle={{ margin: "0 10px" }}
          >
            <Button onClick={(e: React.MouseEvent<HTMLElement>) => e.preventDefault()}>
              <AiFillDelete className={style.delete} />
            </Button>
          </Popconfirm>
          <Popover content={"Add user to project"}>
            <Button
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault();
                openAddUserPopup(e);
              }}
            >
              <IoPersonAdd className={style.addUsers} />
            </Button>
          </Popover>
          {open && <AddUser projectId={projectId} setOpen={setOpen} open={open} />}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
