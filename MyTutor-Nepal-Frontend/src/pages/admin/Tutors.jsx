import axios from "axios";
import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import { HStack, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { getDateAndTime } from "../../components/Utils";
import TabTable from "../../components/common/TabTable";
import IconView from "../../components/TableActions/IconView";

const Tutors = () => {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [approvedTutors, setApprovedTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("fullName", {
      header: "Name",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("createdAt", {
      header: "Applied date",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>
            {getDateAndTime(row.row.original.createdAt, 'utc')}
          </Text>
        );
      },
    }),
    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => {
        return (
          <HStack gap={2}>
            <IconView
            label={'View'}
              handleClick={() => {
                navigate(`/admin/tutors/${row.row.original._id}`);
              }}
            />
          </HStack>
        );
      },
    }),
  ];

  useEffect(() => {
    const getTutor = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_PORT}/api/admin/getAllTutors`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsLoading(false);
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
        setIsLoading(false);
        console.log(error);
      }
    };
    getTutor();
  }, []);
  return (
    <PanelLayout title={"Tutors List"}>
      <TabTable
        firstData={pendingTutors}
        secondData={approvedTutors}
        firstTab={"Pending tutors"}
        secondTab={"Approved tutors"}
        columns={columns}
        isLoading={isLoading}
      />
    </PanelLayout>
  );
};

export default Tutors;
