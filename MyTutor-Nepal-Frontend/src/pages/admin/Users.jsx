import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import axios from "axios";
import { Button, Heading } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";

const Users = () => {
  const [users, setUsers] = useState([]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("fullName", {
      header: "Name",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("role", {
      header: "Role",
    }),
    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => (
        <Button
          onClick={() => {
            console.log(row.row.original._id);
          }}
        >
          Action
        </Button>
      ),
    }),
  ];

  const getUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/admin/getAllUsers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <PanelLayout>
      <Heading>Users List</Heading>
      <DataTable columns={columns} data={users} />
    </PanelLayout>
  );
};

export default Users;
