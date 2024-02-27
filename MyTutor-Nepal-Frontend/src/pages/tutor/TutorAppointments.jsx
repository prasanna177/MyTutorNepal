import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "../../components/DataTable";
import axios from "axios";
import { Button, HStack } from "@chakra-ui/react";
import toast from "react-hot-toast";

const TutorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/tutor/getTutorAppointments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatus = async (appointment, status) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/tutor/updateAppointmentStatus",
        { appointmentId: appointment._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("_id", {
      header: "id",
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => {
        return (
          row.row.original.status === "pending" && (
            <HStack gap={2}>
              <Button
                onClick={() => handleStatus(row.row.original, "approved")}
              >
                Approve
              </Button>
              <Button
                onClick={() => handleStatus(row.row.original, "rejected")}
              >
                Reject
              </Button>
            </HStack>
          )
        );
      },
    }),
  ];

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <PanelLayout>
      <h1>My appointments</h1>
      <DataTable columns={columns} data={appointments} />
    </PanelLayout>
  );
};

export default TutorAppointments;
