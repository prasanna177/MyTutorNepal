import { useEffect, useRef, useState } from "react";
import PanelLayout from "../components/Layout/PanelLayout";
import TabTable from "../components/common/TabTable";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { createColumnHelper } from "@tanstack/react-table";
import { getDateAndTime } from "../components/Utils";
import {
  Badge,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import IconView from "../components/TableActions/IconView";
import toast from "react-hot-toast";
import NormalButton from "../components/common/Button";
import { LinkIcon } from "@chakra-ui/icons";

const MyAssignments = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const [assignment, setAssignment] = useState([]);
  const [pendingAssignments, setPendingAppointments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const schema = yup.object({
    deadline: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
    // columnHelper.accessor((row) => 'Create a triangle and find out its base and', {
    //   header: "Assignment",
    // }),
    columnHelper.accessor((row) => row.difficulty, {
      header: "Difficulty",
    }),
    columnHelper.accessor((row) => getDateAndTime(row.deadline, "utc"), {
      header: "Deadline",
    }),
    columnHelper.accessor("action", {
      header: "ACTION",
      cell: (row) => {
        return (
          <HStack gap={2}>
            <IconView
              label={"View assignment"}
              handleClick={() => {
                onOpen();
                setAssignment(row.row.original);
              }}
            />
          </HStack>
        );
      },
    }),
  ];

  const handleAssignmentSubmission = async (data) => {
    try {
      const formData = new FormData();
      formData.append("submittedFile", selectedFile);
      const filePathUrl = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/uploader/savePdfFilePath`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const submittedFile = filePathUrl.data.pdfFilePath;
      const submissionData = {
        ...data,
        submittedFile,
        assignmentInfo: assignment,
        submissionDate: Date.now(),
      };
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/submit-assignment`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onClose()
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
  }, []);

  return (
    <PanelLayout title={"My assignments"}>
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
          onSubmit={handleSubmit(handleAssignmentSubmission)}
        >
          <ModalHeader>
            <VStack alignItems={"stretch"}>
              <Text variant={"heading2"} color={"black"}>
                Submit assignment
              </Text>
              <Text variant={"subtitle2"}>
                You are about to submit this assignment. Add remarks if you have
                any. You cannot edit your assignment after submission.
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems={"stretch"}>
              <HStack justify={"space-between"}>
                <Text variant={"overline"} color={"primary.0"}>
                  {assignment.title}
                </Text>
                <Badge colorScheme="purple">{assignment.difficulty}</Badge>
              </HStack>
              <VStack alignItems={"start"} w={"100%"}>
                <Text variant={"subtitle1"}>Remarks</Text>
                <FormControl isInvalid={Boolean(errors?.remarks)}>
                  <Textarea {...register("remarks")} placeholder={"Remarks"} />
                  {errors && (
                    <FormErrorMessage>
                      {errors?.remarks?.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </VStack>
              <InputGroup>
                <InputLeftElement>
                  <LinkIcon
                    _hover={{ cursor: "pointer" }}
                    onClick={() => inputRef.current.click()}
                    color="black"
                  />
                </InputLeftElement>
                <Input
                  disabled
                  type="text"
                  placeholder="Attach a file"
                  value={selectedFile?.name || ""}
                  borderColor={"gray.100"}
                />
              </InputGroup>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                ref={inputRef}
                hidden
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <NormalButton
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

export default MyAssignments;
