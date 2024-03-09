import { useEffect, useState } from "react";
import axios from "axios";
import PanelLayout from "../components/Layout/PanelLayout";
import { DataTable } from "../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAppointments = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(
        "http://localhost:4000/api/user/getAllAppointments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsLoading(false)
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      setIsLoading(false)
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
    columnHelper.accessor(
      //will work later, tutorinfo is not an object rn
      (row) => {
        const fromDate = moment(row.fromDate);
        const toDate = moment(row.toDate, "YYYY-MM-DD");
        const nowDate = moment(new Date(), "YYYY-MM-DD").toISOString();
        console.log(fromDate, "from");
        console.log(toDate, "to");
        console.log(nowDate, "now");
        const remainingDays = toDate.diff(nowDate, "days") + 1;
        return remainingDays;
      },
      {
        header: "Remaining days",
      }
    ),
    columnHelper.accessor("status", {
      header: "Status",
    }),
  ];

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <PanelLayout title={'Booking'}>
      <DataTable columns={columns} data={appointments} isLoading={isLoading} />
    </PanelLayout>
  );
};

export default UserAppointments;
