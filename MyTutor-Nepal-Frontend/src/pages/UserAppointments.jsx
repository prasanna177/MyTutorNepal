import { useEffect, useState } from "react";
import axios from "axios";
import PanelLayout from "../components/Layout/PanelLayout";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { HStack, Text } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import TabTable from "../components/common/TabTable";
import { getDate } from "../components/Utils";

const UserAppointments = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getAppointments = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/getAllAppointments`,
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

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor((row) => row.tutorInfo.email, {
      header: "Tutor email",
    }),
    columnHelper.accessor((row) => row.tutorInfo.phone, {
      header: "Tutor phone",
    }),
    columnHelper.accessor("subject", {
      header: "Subject",
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
    columnHelper.accessor(
      (row) => {
        const fromDate = moment(row.fromDate);
        const toDate = moment(row.toDate, "YYYY-MM-DD");
        const nowDate = moment(new Date(), "YYYY-MM-DD").toISOString();
        console.log(fromDate, "from");
        console.log(toDate, "to");
        console.log(nowDate, "now");
        const remainingDays = toDate.diff(nowDate, "days") + 1;
        if (remainingDays <= 0) {
          return 0;
        }
        return remainingDays;
      },
      {
        header: "Remaining days",
      }
    ),
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
                navigate(`/student/appointments/${row.row.original._id}`)
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
    getAppointments();
  }, []);

  return (
    <PanelLayout title={"Booking"}>
      <TabTable
        firstData={pendingAppointments}
        secondData={approvedAppointments}
        firstTab={"Pending appointments"}
        secondTab={"Approved appointments"}
        columns={columns}
        isLoading={isLoading}
      />
    </PanelLayout>
  );
};

export default UserAppointments;
