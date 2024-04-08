import { createColumnHelper } from "@tanstack/react-table";
import PanelLayout from "../components/Layout/PanelLayout";
import { useEffect, useState } from "react";
import { getDate } from "../components/Utils";
import { HStack, Text } from "@chakra-ui/react";
import TabTable from "../components/common/TabTable";
import moment from "moment";
import axios from "axios";

const MyTutors = () => {
  const [trialAppointments, setTrialAppointments] = useState([]);
  const [paidAppointments, setPaidAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("tutorName", {
      header: "Tutor Name",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>
            {row.row.original.tutorInfo.fullName}
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
    columnHelper.accessor("trialPeriod", {
      header: "Trial Period",
      cell: (row) => {
        const fromDate = moment(row.row.original.fromDate, "YYYY-MM-DD");
        const trialEndDate = fromDate.clone().add(3, "days"); // because from date is mutable
        console.log(trialEndDate,'ted')
        const currentDate = moment().startOf("day");

        const remainingDays = trialEndDate.diff(currentDate, "days")

        return (
          <Text variant={"tableBody"}>
            {remainingDays > 0 ? `${remainingDays} day(s) left` : "Expired"}
          </Text>
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
        console.log(row.row.original, "row");
        return <HStack gap={2}></HStack>;
      },
    }),
  ];

  useEffect(() => {
    const getAppointments = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${
            import.meta.env.VITE_SERVER_PORT
          }/api/user/get-user-ongoing-appointments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res, "res ");
        setIsLoading(false);
        if (res.data.success) {
          const trialAppointments = res.data.data.filter(
            (appointment) => appointment.paymentStatus === "Pending"
          );
          const paidAppointments = res.data.data.filter(
            (appointment) => appointment.paymentStatus === "Paid"
          );
          setTrialAppointments(trialAppointments);
          setPaidAppointments(paidAppointments);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    getAppointments();
  }, []);
  return (
    <PanelLayout title={"My tutors"}>
      <TabTable
        firstData={trialAppointments}
        firstTab={"Trial appointments"}
        secondData={paidAppointments}
        secondTab={"Active appointments"}
        columns={columns}
        isLoading={isLoading}
      />
    </PanelLayout>
  );
};

export default MyTutors;
