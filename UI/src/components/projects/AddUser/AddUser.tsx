import { useEffect, useState } from "react";
import { Button, Drawer, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { api } from "@/utils/axios.instance";

const columns: ColumnsType<IUsers> = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Role",
    dataIndex: "role",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Active",
    dataIndex: "active",
    render: (value) => {
      return <p>{value === true ? "Yes" : "No"}</p>;
    },
  },
];

export default function AddUser({ setOpen, open }: AddUserProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [users, setUsers] = useState<IUsers[]>([]);

  const getUsers = async (): Promise<void> => {
    const { data } = await api.get("/users");
    setUsers(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const onClose = () => {
    setOpen(false);
  };

  const rowSelection: TableRowSelection<IUsers> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: IUsers[]) => {
      console.log("selectedRowKeys changed: ", newSelectedRowKeys, selectedRows);
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: IUsers) => ({
      disabled: record.active === false, // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
      <Drawer
        title={"Add User"}
        placement="right"
        size={"large"}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </Space>
        }
      >
        <div>
          <Table
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={users}
            pagination={false}
            rowKey={"id"}
          />
        </div>
      </Drawer>
    </>
  );
}
