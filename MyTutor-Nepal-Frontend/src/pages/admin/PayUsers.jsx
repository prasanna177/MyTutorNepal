import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import { Text, HStack } from "@chakra-ui/react";
import TabTable from "../../components/common/TabTable";
import { createColumnHelper } from "@tanstack/react-table";
import IconCheck from "../../components/TableActions/IconCheck";
import axios from "axios";
import toast from "react-hot-toast";
import { getDateAndTime } from "../../components/Utils";

const PayUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [unpaidTutors, setUnpaidTutors] = useState([]);
  const [unpaidUsers, setUnpaidUsers] = useState([]);
  const [paidAppointments, setPaidAppointments] = useState([]);

  const handleMarkAsPaid = async (appointment) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/appointment/mark-as-paid`,
        { appointmentId: appointment._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        getAppointments();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("createdAt", {
      header: "Appointment date",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>
            {getDateAndTime(row.row.original.createdAt)}
          </Text>
        );
      },
    }),
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
    columnHelper.accessor("studentPhone", {
      header: "Student phone",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>{row.row.original.userInfo.phone}</Text>
        );
      },
    }),
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
    columnHelper.accessor("tutorPhone", {
      header: "Tutor phone",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>{row.row.original.tutorInfo.phone}</Text>
        );
      },
    }),
    columnHelper.accessor("totalPrice", {
      header: "Total Price",
    }),
    columnHelper.accessor("status", {
      header: "Type",
      cell: (row) => {
        const status = row.row.original.status;

        let type;
        if (status === "approved" || status === "completed") {
          type = "Pay Tutor";
        } else if (status === "cancelled") {
          type = "Refund";
        }
        return <Text variant={"tableBody"}>{type}</Text>;
      },
    }),
    columnHelper.accessor("paymentStatus", {
      header: "Payment status",
    }),
    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => {
        return (
          <HStack gap={2}>
            {row.row.original.paymentStatus === "Processing" && (
              <IconCheck
                label={"Mark as paid"}
                handleClick={() => handleMarkAsPaid(row.row.original)}
              />
            )}
          </HStack>
        );
      },
    }),
  ];

  const getAppointments = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${
          import.meta.env.VITE_SERVER_PORT
        }/api/appointment/get-all-appointments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsLoading(false);
      if (res.data.success) {
        const unpaidTutors = res.data.data.filter(
          (appointment) =>
            appointment.paymentStatus === "Processing" &&
            (appointment.status === "approved" ||
              appointment.status === "completed") &&
            appointment.paymentType === "Khalti"
        );
        const unpaidUsers = res.data.data.filter(
          (appointment) =>
            appointment.paymentStatus === "Processing" &&
            appointment.status === "cancelled" &&
            appointment.paymentType === "Khalti"
        );
        const paidAppointments = res.data.data.filter(
          (appointment) =>
            appointment.paymentStatus === "Paid" &&
            appointment.status !== "pending" && //completed, pending, approved, cancelled
            appointment.paymentType === "Khalti"
        );

        setUnpaidTutors(unpaidTutors);
        setUnpaidUsers(unpaidUsers);
        setPaidAppointments(paidAppointments);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <PanelLayout title={"Pay users"}>
      <TabTable
        firstData={unpaidTutors}
        firstTab={"Unpaid tutors"}
        secondData={unpaidUsers}
        secondTab={"Refund students"}
        thirdData={paidAppointments}
        thirdTab={"Paid users"}
        hasThreeTabs={true}
        isLoading={isLoading}
        columns={columns}
      />
    </PanelLayout>
  );
};

export default PayUsers;
