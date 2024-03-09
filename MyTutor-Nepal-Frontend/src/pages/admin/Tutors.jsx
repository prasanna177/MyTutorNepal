import axios from "axios";
import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { DataTable } from "../../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { ViewIcon } from "@chakra-ui/icons";

const Tutors = () => {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [approvedTutors, setApprovedTutors] = useState([]);
  const navigate = useNavigate();

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("fullName", {
      header: "Name",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => {
        return (
          <ViewIcon
            color={"primary.0"}
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              navigate(`/admin/tutors/${row.row.original._id}`);
            }}
          >
            View
          </ViewIcon>
        );
      },
    }),
  ];

  const getTutor = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/admin/getAllTutors",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        const pendingTutors = res.data.data.filter(
          (tutor) => tutor.status === "Pending"
        );
        const approvedTutors = res.data.data.filter(
          (tutor) => tutor.status === "Approved"
        );
        setApprovedTutors(approvedTutors);
        setPendingTutors(pendingTutors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTutor();
  }, []);
  return (
    <PanelLayout title={"Tutors List"}>
      <Tabs>
        <TabList>
          <Tab>Pending Tutors</Tab>
          <Tab>Approved Tutors</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <DataTable columns={columns} data={pendingTutors} />
          </TabPanel>
          <TabPanel>
            <DataTable columns={columns} data={approvedTutors} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PanelLayout>
  );
};

export default Tutors;
