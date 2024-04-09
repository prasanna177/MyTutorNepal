import { useEffect, useState } from "react";
import axios from "axios";
import PanelLayout from "../components/Layout/PanelLayout";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { HStack, Text } from "@chakra-ui/react";
import TabTable from "../components/common/TabTable";
import { getDate } from "../components/Utils";
import IconView from "../components/TableActions/IconView";

const UserAppointments = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
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

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor((row) => row.tutorInfo.fullName, {
      header: "Tutor name",
    }),
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

    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => {
        return (
          <HStack gap={2}>
            <IconView
              label={"View"}
              handleClick={() =>
                navigate(`/student/appointments/${row.row.original._id}`)
              }
            />
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
        thirdData={completedAppointments}
        firstTab={"Pending appointments"}
        secondTab={"Approved appointments"}
        thirdTab={"Completed appointments"}
        columns={columns}
        hasThreeTabs={true}
        isLoading={isLoading}
      />
    </PanelLayout>
  );
};

export default UserAppointments;
