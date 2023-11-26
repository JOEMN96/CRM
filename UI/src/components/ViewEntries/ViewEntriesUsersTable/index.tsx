import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Modal } from "antd";
import { useState } from "react";
import { api } from "@/utils/axios.instance";
import EntriesTable from "../EntriesTable";

const getUserEntries = async (userId: number) => {
  let res = await api.get(`/calender/getEntriesById/${userId}`);
  return res.data;
};

export default function ViewEntriesUsersTable({ users }: EntriesUsersProps) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<IEntries[] | null>(null);

  const showUserEntries = async ({ id }: EntriesUser) => {
    const usersEntries = await getUserEntries(id);
    setEntries(usersEntries);
    showModal();
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
    setEntries(null);
  };

  const handleCancel = () => {
    setOpen(false);
    setEntries(null);
  };

  const columns: ColumnsType<EntriesUser> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, row) => (
        <p style={{ color: "#0c6bffcc", cursor: "pointer" }} onClick={() => showUserEntries(row)}>
          {text}
        </p>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Active",
      dataIndex: "active",
      render: (value) => {
        return <p>{value === true ? "Yes" : "No"}</p>;
      },
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={users} rowKey={"id"} pagination={false} />

      {entries && (
        <Modal
          title="Entries"
          width={"50%"}
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          destroyOnClose={true}
          footer={() => <></>}
        >
          <EntriesTable entries={entries} />
        </Modal>
      )}
    </div>
  );
}
