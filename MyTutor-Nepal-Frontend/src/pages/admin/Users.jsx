import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import axios from "axios";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import { ViewIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

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
        <ViewIcon
          color={"primary.0"}
          _hover={{ cursor: "pointer" }}
          onClick={() => {
            navigate(`/admin/users/${row.row.original._id}`);
          }}
        >
          View
        </ViewIcon>
      ),
    }),
  ];

  useEffect(() => {
    const getUsers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          "http://localhost:4000/api/admin/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsLoading(false);
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    getUsers();
  }, []);

  return (
    <PanelLayout title={"Users List"}>
      <DataTable columns={columns} data={users} isLoading={isLoading} />
    </PanelLayout>
  );
};

export default Users;
