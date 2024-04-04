import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormErrorMessage,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getDate } from "../../components/Utils";
import IconView from "../../components/TableActions/IconView";
import IconAssignment from "../../components/TableActions/IconAssignment";
import NormalButton from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import { difficulties } from "../../data/difficultyData";
import toast from "react-hot-toast";
import { DataTable } from "../../components/DataTable";

const Students = () => {
  const [assignmentUsers, setAssignmentUsers] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
    columnHelper.accessor("subject", {
      header: "Subject",
    }),
    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => {
        console.log(row.row.original, "row");
        return (
          <HStack gap={2}>
            <IconView
              handleClick={() =>
                navigate(`/tutor/appointments/${row.row.original._id}`)
              }
            />
            <IconAssignment
              handleClick={() => {
                setAssignmentUsers({
                  studentId: row.row.original.userId,
                  tutorId: row.row.original.tutorId,
                  appointmentId: row.row.original._id,
                });
                onOpen();
              }}
            />
          </HStack>
        );
      },
    }),
  ];

  const handleAssignmentCreation = async (data) => {
    try {
      const { studentId, tutorId, appointmentId } = assignmentUsers;
      const submissionData = {
        ...data,
        studentId,
        tutorId,
        appointmentId,
      };
      setIsLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/tutor/createAssignment`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onClose();
      setIsLoading(false);
      console.log(res, "res");
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error("Something went wrong");
    }
    console.log({ ...data, ...assignmentUsers });
  };

  useEffect(() => {
    const getAppointments = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${
            import.meta.env.VITE_SERVER_PORT
          }/api/tutor/getTutorOngoingAppointments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res, "res ");
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

  const schema = yup.object({
    deadline: yup.string().required("Please enter the deadline"),
    title: yup.string().required("Please enter title"),
    difficulty: yup.string().required("Please provide difficulty"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  console.log(appointments, "app");
  return (
    <PanelLayout title={"My students"}>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setAssignmentUsers(null);
        }}
      >
        <ModalOverlay />
        <ModalContent
          as={"form"}
          onSubmit={handleSubmit(handleAssignmentCreation)}
        >
          <ModalHeader>
            <Text variant={"heading2"} color={"black"}>
              Provide assignment
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems={"stretch"}>
              <HStack>
                <TextField
                  flex={2}
                  hasLabel={true}
                  label={"Deadline"}
                  type={"datetime-local"}
                  name={"deadline"}
                  isNotRequired={true}
                  errors={errors?.deadline?.message}
                  register={register}
                />
                <VStack flex={1} alignItems={"start"} w={"100%"}>
                  <Text variant={"subtitle1"}>Difficulty</Text>
                  <FormControl isInvalid={Boolean(errors?.difficulty)}>
                    <Select
                      {...register("difficulty")}
                      placeholder="Difficulty"
                    >
                      {difficulties.map((item) => (
                        <option key={item.id} value={item.difficulty}>
                          {item.difficulty}
                        </option>
                      ))}
                    </Select>
                    {errors && (
                      <FormErrorMessage>
                        {errors?.difficulty?.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </VStack>
              </HStack>
              <VStack alignItems={"start"} w={"100%"}>
                <Text variant={"subtitle1"}>Title</Text>
                <FormControl isInvalid={Boolean(errors?.title)}>
                  <Textarea {...register("title")} placeholder={"Title"} />
                  {errors && (
                    <FormErrorMessage>
                      {errors?.title?.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <NormalButton
              color="white"
              bgColor={"primary.0"}
              mr={3}
              type="submit"
              text={"Create"}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
      <DataTable data={appointments} columns={columns} isLoading={isLoading} />
    </PanelLayout>
  );
};

export default Students;
