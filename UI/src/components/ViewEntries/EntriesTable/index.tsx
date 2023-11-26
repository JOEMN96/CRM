import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";

const columns: ColumnsType<IEntries> = [
  {
    title: "Description",
    dataIndex: "workDescription",
    render: (text: string) => <pre>{text}</pre>,
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    render: (text: string) => moment(text).format("DD-MM-YYYY"),
  },
];

export default function EntriesTable({ entries }: IEntriesTableProps) {
  return (
    <div>
      <Table columns={columns} dataSource={entries} rowKey={"id"} pagination={false} />
    </div>
  );
}
