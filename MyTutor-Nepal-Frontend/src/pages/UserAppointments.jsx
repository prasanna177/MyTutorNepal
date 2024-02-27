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
    // columnHelper.accessor(
    //   //will work later, tutorinfo is not an object rn
    //   (row) => {
    //     const fromDate = moment(row.tutorInfo.fromDate);
    //     const toDate = moment(row.tutorInfo.toDate, "YYYY-MM-DD");
    //     const nowDate = moment(new Date(), "YYYY-MM-DD").toISOString();
    //     const remainingDays = toDate.diff(fromDate, "days");
    //     return remainingDays;
    //   },
    //   {
    //     header: "Tutor",
    //   }
    // ),
    columnHelper.accessor("status", {
      header: "Status",
    }),
  ];

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <PanelLayout>
      <h1>Booking</h1>
      <DataTable columns={columns} data={appointments} />
    </PanelLayout>
  );
};

export default UserAppointments;
