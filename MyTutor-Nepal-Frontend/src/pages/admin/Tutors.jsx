import axios from "axios";
import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import {
  Box,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { DataTable } from "../../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { ViewIcon } from "@chakra-ui/icons";

const Tutors = () => {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [approvedTutors, setApprovedTutors] = useState([]);
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
    columnHelper.accessor("createdAt", {
      header: "Applied date",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>
            {new Date(row.row.original.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </Text>
        );
      },
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

  useEffect(() => {
    const getTutor = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          "http://localhost:4000/api/admin/getAllTutors",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsLoading(false);
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
        setIsLoading(false);
        console.log(error);
      }
    };
    getTutor();
  }, []);
  return (
    <PanelLayout title={"Tutors List"}>
      <Tabs variant={"soft-rounded"} colorScheme="purple">
        <TabList>
          <Tab>
            <HStack>
              <Text>Pending Tutors</Text>
              <Box>({pendingTutors.length})</Box>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <Text>Approved Tutors</Text>
              <Box>({approvedTutors.length})</Box>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <DataTable
              columns={columns}
              data={pendingTutors}
              isLoading={isLoading}
            />
          </TabPanel>
          <TabPanel>
            <DataTable
              columns={columns}
              data={approvedTutors}
              isLoading={isLoading}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PanelLayout>
  );
};

export default Tutors;
