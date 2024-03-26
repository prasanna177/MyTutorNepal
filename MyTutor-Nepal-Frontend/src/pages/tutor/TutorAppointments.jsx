import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import { HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getDate } from "../../components/Utils";
import { ViewIcon } from "@chakra-ui/icons";
import TabTable from "../../components/common/TabTable";

const TutorAppointments = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("studentName", {
      header: "Student Name",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>
            {row.row.original.userInfo.fullName}
          </Text>
        );
      },
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
          `${import.meta.env.VITE_SERVER_PORT}/api/tutor/getTutorAppointments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res);
        setIsLoading(false);
        if (res.data.success) {
          const pendingAppointments = res.data.data.filter(
            (appointment) => appointment.status === "pending"
          );
          const approvedAppointments = res.data.data.filter(
            (appointment) => appointment.status === "approved"
          );
          const completedAppointments = res.data.data.filter(
            (appointment) => appointment.status === "completed"
          );
          setPendingAppointments(pendingAppointments);
          setApprovedAppointments(approvedAppointments);
          setCompletedAppointments(completedAppointments);
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
      <TabTable
        firstData={pendingAppointments}
        secondData={approvedAppointments}
        thirdData={completedAppointments}
        firstTab={"Pending appointments"}
        secondTab={"Approved appointments"}
        thirdTab={"Completed Appointments"}
        hasThreeTabs={true}
        columns={columns}
        isLoading={isLoading}
      />
    </PanelLayout>
  );
};

export default TutorAppointments;
