import { useEffect, useState } from "react";
import axios from "axios";
import PanelLayout from "../components/Layout/PanelLayout";
import { DataTable } from "../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/user/getAllAppointments",
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

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor((row) => row.tutorInfo.email, {
      header: "Tutor email",
    }),
  ];

  useEffect(() => {
    getAppointments();
  }, []);

  console.log(appointments, "app");
  return (
    <PanelLayout>
      <h1>Booking</h1>
      <DataTable columns={columns} data={appointments} />
    </PanelLayout>
  );
};

export default UserAppointments;
