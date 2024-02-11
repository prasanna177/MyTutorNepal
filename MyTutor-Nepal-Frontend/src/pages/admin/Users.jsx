import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import axios from "axios";
import {
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";

const Users = () => {
  const [users, setUsers] = useState([]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("fromUnit", {
      cell: (info) => info.getValue(),
      header: "To convert",
    }),
    columnHelper.accessor("toUnit", {
      cell: (info) => info.getValue(),
      header: "Into",
    }),
    columnHelper.accessor("factor", {
      cell: (info) => info.getValue(),
      header: "Multiply by",
      meta: {
        isNumeric: true,
      },
    }),
  ];

  const data = [
    {
      fromUnit: "inches",
      toUnit: "millimetres (mm)",
      factor: 25.4,
    },
    {
      fromUnit: "feet",
      toUnit: "centimetres (cm)",
      factor: 30.48,
    },
    {
      fromUnit: "yards",
      toUnit: "metres (m)",
      factor: 0.91444,
    },
  ];

  const col = [
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
        <ButtonGroup>
          <Button
            aria-label="edit"
            variant="ghost"

          />
        </ButtonGroup>
      )
    })
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

  // useEffect(() => {
  //   console.log(users);
  // }, [users]);
  // console.log(users, "ssss");

  // const as = [
  //   {
  //     fullName: "asd",
  //     email: "asdsad",
  //     role: "asdsadsad",
  //   },
  //   {
  //     fullName: "asasd",
  //     email: "asdssad",
  //     role: "asdssadsad",
  //   },
  // ];

  return (
    <PanelLayout>
      <Heading>Users List</Heading>
      <DataTable columns={col} data={users} />
    </PanelLayout>
  );
};

export default Users;
