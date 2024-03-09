import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import axios from "axios";
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
import { useNavigate } from "react-router-dom";
import { getDate } from "../../components/Utils";
import { ViewIcon } from "@chakra-ui/icons";

const TutorAppointments = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("_id", {
      header: "id",
    }),
    columnHelper.accessor("fromDate", {
      header: "From Date",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>
            {getDate(row.row.original.fromDate)}
          </Text>
        );
      },
    }),
    columnHelper.accessor("toDate", {
      header: "To Date",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>{getDate(row.row.original.toDate)}</Text>
        );
      },
    }),
    columnHelper.accessor("totalPrice", {
      header: "Total Price",
    }),
    columnHelper.accessor("subject", {
      header: "Subject",
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => {
        return (
          <HStack gap={2}>
            {/* <Button onClick={() => handleStatus(row.row.original)}>
              Approve
            </Button> */}
            <ViewIcon
              _hover={{ cursor: "pointer" }}
              color={"primary.0"}
              onClick={() =>
                navigate(`/tutor/appointments/${row.row.original._id}`)
              }
            >
              View
            </ViewIcon>
          </HStack>
        );
      },
    }),
  ];

  useEffect(() => {
    const getAppointments = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          "http://localhost:4000/api/tutor/getTutorAppointments",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsLoading(false);
        if (res.data.success) {
          const pendingAppointments = res.data.data.filter(
            (appointment) => appointment.status === "pending"
          );
          const approvedAppointments = res.data.data.filter(
            (appointment) => appointment.status === "approved"
          );
          setPendingAppointments(pendingAppointments);
          setApprovedAppointments(approvedAppointments);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    getAppointments();
  }, []);

  return (
    <PanelLayout title={"My appointments"}>
      <Tabs variant={"soft-rounded"} colorScheme="purple">
        <TabList>
          <Tab>
            <HStack>
              <Text>Pending Appointments</Text>
              <Box>({pendingAppointments.length})</Box>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <Text>Approved Tutors</Text>
              <Box>({approvedAppointments.length})</Box>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <DataTable
              columns={columns}
              data={pendingAppointments}
              isLoading={isLoading}
            />
          </TabPanel>
          <TabPanel>
            <DataTable
              columns={columns}
              data={approvedAppointments}
              isLoading={isLoading}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PanelLayout>
  );
};

export default TutorAppointments;
