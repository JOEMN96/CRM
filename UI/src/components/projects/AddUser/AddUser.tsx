import { useEffect, useState } from "react";
import { Button, Drawer, Space, Table, notification } from "antd";
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

export default function AddUser({ setOpen, open, projectId }: AddUserProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [users, setUsers] = useState<IUsers[]>([]);

  const getUsers = async (): Promise<void> => {
    const { data } = await api.get(`/projects/getAssignedUsersForProject?id=${projectId}`);
    let selectedIds = data.filter((user: IUsers) => user.selected === true).map((user: IUsers) => user.id);
    setUsers(data);
    setSelectedRowKeys(selectedIds);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const onClose = () => {
    setOpen(false);
  };

  const onUpdate = async () => {
    try {
      await api.post("/projects/addUsers", { addedusers: selectedRowKeys, projectId: projectId });
      notification.open({ message: "Users Added successfully", type: "success", duration: 2 });
      setOpen(false);
    } catch (error: any) {
      notification.open({ message: error?.response?.data?.message || "Server error", type: "error", duration: 3 });
    }
  };

  const rowSelection: TableRowSelection<IUsers> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: IUsers[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: IUsers) => ({
      disabled: record.active === false, // Column configuration not to be checked
      name: record.name,
    }),
    onSelect: (record, isSelected) => {
      record.selected = !isSelected;
      record.modified = true;
    },
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
            <Button type="primary" onClick={onUpdate}>
              Update
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
