import axios from "axios";
import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { DataTable } from "../../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Tutors = () => {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [approvedTutors, setApprovedTutors] = useState([]);
  const navigate = useNavigate();

  const handleAccountStatus = async (tutorObj, status) => {
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
        navigate("/admin/tutors");
        window.location.reload()
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleAccountRejection = async (tutorId) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/tutor/deleteTutorById",
        { tutorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/tutors");
        window.location.reload()
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
        return (
          <>
            {row.row.original.status === "Pending" && (
              <>
                <Button
                  onClick={() =>
                    handleAccountStatus(row.row.original, "Approved")
                  }
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleAccountRejection(row.row.original._id)}
                >
                  Reject
                </Button>
              </>
            )}

            <Button
              onClick={() => {
                navigate(`/admin/tutors/${row.row.original._id}`);
              }}
            >
              View
            </Button>
          </>
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
        const pendingTutors = res.data.data.filter(
          (tutor) => tutor.status === "Pending"
        );
        const approvedTutors = res.data.data.filter(
          (tutor) => tutor.status === "Approved"
        );
        setApprovedTutors(approvedTutors);
        setPendingTutors(pendingTutors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTutor();
  }, []);
  return (
    <PanelLayout title={"Tutors List"}>
      <Tabs>
        <TabList>
          <Tab>Pending Tutors</Tab>
          <Tab>Approved Tutors</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <DataTable columns={columns} data={pendingTutors} />
          </TabPanel>
          <TabPanel>
            <DataTable columns={columns} data={approvedTutors} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PanelLayout>
  );
};

export default Tutors;
