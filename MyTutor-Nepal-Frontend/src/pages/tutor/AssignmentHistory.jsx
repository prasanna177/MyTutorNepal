import { useEffect, useState } from "react";
import PanelLayout from "../../components/Layout/PanelLayout";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  HStack,
  Text,
  VStack,
  FormControl,
  FormErrorMessage,
  Textarea,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
} from "@chakra-ui/react";
import axios from "axios";
import { createColumnHelper } from "@tanstack/react-table";
import { getDateAndTime } from "../../components/Utils";
import toast from "react-hot-toast";
import IconView from "../../components/TableActions/IconView";
import TabTable from "../../components/common/TabTable";
import NormalButton from "../../components/common/Button";
import { useForm } from "react-hook-form";

import { LinkIcon } from "@chakra-ui/icons";
import TextField from "../../components/common/TextField";
// import { useDispatch } from "react-redux";
// import { hideLoading, showLoading } from "../../redux/features/alertSlice";

const AssignmentHistory = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignment, setAssignment] = useState({});
  const [pendingAssignments, setPendingAppointments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  console.log(assignment, "ass");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = () => {
    // Open the image in a new tab when clicked
    window.open(
      `${import.meta.env.VITE_SERVER_PORT}/${assignment.submittedFile}`,
      "_blank"
    );
  };

  const schema = yup.object({
    feedback: yup.string(),
    grade: yup
      .number()
      .min(0, "Grade must be greater than or equal to 0")
      .max(100, "Grade must be less than or equal to 100")
      .typeError("Grade must be a number")
      .required("Grade is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const dispatch = useDispatch();

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("title", {
      header: "Assignment",
    }),
    columnHelper.accessor("createdAt", {
      header: "Provided at",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>
            {getDateAndTime(row.row.original.createdAt)}
          </Text>
        );
      },
    }),
    columnHelper.accessor("deadline", {
      header: "Deadline",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>
            {getDateAndTime(row.row.original.deadline, "utc")}
          </Text>
        );
      },
    }),
    columnHelper.accessor("submissionDate", {
      header: "Submission Date",
      cell: (row) => {
        return (
          <Text variant={"tableBody"}>
            {row.row.original.submissionDate
              ? getDateAndTime(row.row.original.submissionDate, "utc")
              : "N/A"}
          </Text>
        );
      },
    }),
    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => {
        return (
          <HStack gap={2}>
            {row.row.original.status === "Submitted" && (
              <IconView
                label={"View"}
                handleClick={() => {
                  setAssignment(row.row.original);
                  onOpen();
                }}
              />
            )}
          </HStack>
        );
      },
    }),
  ];

  const getAssignments = async () => {
    try {
      setIsLoading(true);
      // dispatch(showLoading());
      const res = await axios.post(
        `${
          import.meta.env.VITE_SERVER_PORT
        }/api/tutor/get-assignments-for-appointment`,
        { appointmentId: params.appointmentId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      // dispatch(hideLoading());
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
        setAssignments(res.data.data);
      }
    } catch (error) {
      // dispatch(hideLoading());
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleAssignmentGrade = async (data) => {
    try {
      const submissionData = { ...data, assignmentInfo: assignment };
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/tutor/grade-assignment`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onClose();
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAssignments();
    //eslint-disable-next-line
  }, []);

  return (
    <PanelLayout
      title={`${
        assignments.length > 0 &&
        assignments[0].appointmentInfo?.userInfo?.fullName
      }'s assignment history`}
    >
      <Modal
        size={"xl"}
        isCentered={true}
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent
          as={"form"}
          onSubmit={handleSubmit(handleAssignmentGrade)}
        >
          <ModalHeader>
            <VStack alignItems={"stretch"}>
              <Text variant={"heading2"} color={"black"}>
                Grade assignment
              </Text>
              <HStack justify={"space-between"}>
                <Text variant={"overline"} color={"primary.0"}>
                  {assignment.title}
                </Text>
                <Badge colorScheme="purple">{assignment.difficulty}</Badge>
              </HStack>
              <VStack alignItems={"start"} w={"100%"}>
                <Text variant={"subtitle1"}>Student&apos;s remarks </Text>
                <Textarea
                  _hover={{ cursor: "auto" }}
                  readOnly
                  value={assignment.remarks}
                />
              </VStack>

              <InputGroup onClick={handleClick}>
                <InputLeftElement>
                  <LinkIcon _hover={{ cursor: "pointer" }} color="black" />
                </InputLeftElement>
                <Input
                  readOnly
                  _hover={{ cursor: "auto" }}
                  type="text"
                  placeholder="Attach a file"
                  value={"Click to view pdf submission"}
                  borderColor={"gray.100"}
                />
              </InputGroup>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack alignItems={"stretch"}>
              <VStack flex={2} alignItems={"start"} w={"100%"}>
                <Text variant={"subtitle1"}>Feedback</Text>
                <FormControl isInvalid={Boolean(errors?.feedback)}>
                  <Textarea
                    value={assignment.feedback}
                    readOnly={Boolean(assignment.feedback)}
                    _hover={{ cursor: "auto" }}
                    {...register("feedback")}
                    placeholder={"Feedback"}
                  />
                  {errors && (
                    <FormErrorMessage>
                      {errors?.feedback?.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </VStack>
              <TextField
                value={assignment.grade}
                readOnly={Boolean(assignment.grade)}
                flex={1}
                name={"grade"}
                register={register}
                errors={errors?.grade?.message}
                placeholder={"Grade"}
                label={"Grade (1-100)"}
              />
            </HStack>
          </ModalBody>

          <ModalFooter>
            <NormalButton
              disabled={Boolean(assignment.grade)}
              color="white"
              bgColor={"primary.0"}
              mr={3}
              type="submit"
              text={"Submit"}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
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

export default AssignmentHistory;
