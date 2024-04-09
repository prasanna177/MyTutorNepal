import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import TabTable from "../../components/common/TabTable";
import { createColumnHelper } from "@tanstack/react-table";
import { HStack, Text } from "@chakra-ui/react";
import { getDate } from "../../components/Utils";
import axios from "axios";
import toast from "react-hot-toast";
import IconCheck from "../../components/TableActions/IconCheck";

const TutorPayment = () => {
  const [unpaidAppointments, setUnpaidAppointments] = useState([]);
  const [paidAppointments, setPaidAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleMarkAsPaid = async (appointment) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/tutor/mark-as-paid`,
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
    columnHelper.accessor("paymentType", {
      header: "Payment type",
    }),
    columnHelper.accessor("subject", {
      header: "Subject",
    }),
    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => {
        return (
          <HStack gap={2}>
            {row.row.original.paymentType === "Cash on delivery" &&
              row.row.original.paymentStatus === "Pending" && (
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
        const unpaidAppointments = res.data.data.filter(
          (appointment) => appointment.paymentStatus === "Pending"
        );
        const paidAppointments = res.data.data.filter(
          (appointment) => appointment.paymentStatus === "Paid"
        );

        setUnpaidAppointments(unpaidAppointments);
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
    <PanelLayout title={"Appointment payments"}>
      <TabTable
        firstData={unpaidAppointments}
        secondData={paidAppointments}
        firstTab={"Unpaid appointments"}
        secondTab={"Paid appointments"}
        columns={columns}
        isLoading={isLoading}
      />
    </PanelLayout>
  );
};

export default TutorPayment;
