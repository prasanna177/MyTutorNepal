import axios from "axios";
import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import { Button, Heading } from "@chakra-ui/react";
import { DataTable } from "../../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import toast from "react-hot-toast";

const Tutors = () => {
  const [tutors, setTutors] = useState([]);

  const handleAcountStatus = async (tutorObj, status) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/admin/changeAccountStatus",
        { tutorId: tutorObj._id, userId: tutorObj.userId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("fullName", {
      header: "Name",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => {
        return row.row.original.status === "Pending" ? (
          <Button
            onClick={() => handleAcountStatus(row.row.original, "Approved")}
          >
            Approve
          </Button>
        ) : (
          <Button>Reject</Button>
        );
      },
    }),
  ];

  const getTutor = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/admin/getAllTutors",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setTutors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTutor();
  }, []);
  return (
    <PanelLayout>
      <Heading>Tutors List</Heading>
      <DataTable columns={columns} data={tutors} />
    </PanelLayout>
  );
};

export default Tutors;
