import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";

const columns: ColumnsType<EntriesUser> = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text: string) => <Link href={"/d"}> {text} </Link>,
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

export default function ViewEntriesUsersTable({ users }: EntriesUsersProps) {
  return (
    <div>
      <Table columns={columns} dataSource={users} rowKey={"id"} pagination={false} />
    </div>
  );
}
