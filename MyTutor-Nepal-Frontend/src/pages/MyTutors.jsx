import { createColumnHelper } from "@tanstack/react-table";
import PanelLayout from "../components/Layout/PanelLayout";
import { useEffect, useState } from "react";
import { getDate, getTime } from "../components/Utils";
import { Text } from "@chakra-ui/react";
import axios from "axios";
import { DataTable } from "../components/DataTable";

const MyTutors = () => {
  const [appointments, setAppointments] = useState([]);
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
    columnHelper.accessor("timings", {
      header: "Time",
      cell: (row) => {
        console.log(row);
        return (
          <Text variant={"tableBody"}>{getTime(row.row.original.time)}</Text>
        );
      },
    }),

    columnHelper.accessor("subject", {
      header: "Subject",
    }),
  ];

  useEffect(() => {
    const getAppointments = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${
            import.meta.env.VITE_SERVER_PORT
          }/api/appointment/get-user-ongoing-appointments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsLoading(false);
        if (res.data.success) {
          setAppointments(res.data.data);
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
      <DataTable data={appointments} columns={columns} isLoading={isLoading} />
    </PanelLayout>
  );
};

export default MyTutors;
