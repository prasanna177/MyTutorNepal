import { useEffect, useState } from "react";
import PanelLayout from "../components/Layout/PanelLayout";
import TabTable from "../components/common/TabTable";
import axios from "axios";
import { createColumnHelper } from "@tanstack/react-table";
import { getDateAndTime } from "../components/Utils";

const MyAssignments = () => {
  const [pendingAssignments, setPendingAppointments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAssignments = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/getUserAssignments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsLoading(false);
      if (res.data.success) {
        const pendingAssignments = res.data.data.filter(
          (appointment) => appointment.status === "Pending"
        );
        const submittedAssignments = res.data.data.filter(
          (appointment) => appointment.status === "Submitted"
        );
        setPendingAppointments(pendingAssignments);
        setSubmittedAssignments(submittedAssignments);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor((row) => row.appointmentInfo.tutorInfo.fullName, {
      header: "Tutor",
    }),
    columnHelper.accessor((row) => row.appointmentInfo.subject, {
      header: "Subject",
    }),
    columnHelper.accessor((row) => row.title, {
      header: "Assignment",
    }),
    columnHelper.accessor((row) => row.difficulty, {
      header: "Difficulty",
    }),
    columnHelper.accessor((row) => getDateAndTime(row.deadline, "utc"), {
      header: "Deadline",
    }),
  ];

  useEffect(() => {
    getAssignments();
  }, []);

  return (
    <PanelLayout title={"My assignments"}>
      <TabTable
        firstData={pendingAssignments}
        secondData={submittedAssignments}
        firstTab={"Pending Assignments"}
        secondTab={"Submitted Assignments"}
        columns={columns}
        isLoading={isLoading}
      />
    </PanelLayout>
  );
};

export default MyAssignments;
