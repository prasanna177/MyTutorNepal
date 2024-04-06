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
import toast from "react-hot-toast";
import NormalButton from "../components/common/Button";
import { LinkIcon } from "@chakra-ui/icons";
import IconSubmit from "../components/TableActions/IconSubmit";
import IconView from "../components/TableActions/IconView";
import TextField from "../components/common/TextField";

const MyAssignments = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const [assignment, setAssignment] = useState([]);
  const [pendingAssignments, setPendingAppointments] = useState([]);
  const [missedAssignments, setMissedAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef(null);

  const {
    isOpen: isSubmitModalOpen,
    onOpen: onOpenSubmitModal,
    onClose: onCloseSubmitModal,
  } = useDisclosure();

  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onOpenFeedbackModal,
    onClose: onCloseFeedbackModal,
  } = useDisclosure();

  const handleClick = () => {
    // Open the image in a new tab when clicked
    window.open(
      `${import.meta.env.VITE_SERVER_PORT}/${assignment.submittedFile}`,
      "_blank"
    );
  };

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
        const missedAssignments = res.data.data.filter(
          (appointment) => appointment.status === "Missed"
        );
        setPendingAppointments(pendingAssignments);
        setSubmittedAssignments(submittedAssignments);
        setMissedAssignments(missedAssignments);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor((row) => row.title, {
      header: "Assignment",
    }),
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
            {row.row.original.status === "Pending" ? (
              <IconSubmit
                label={"Submit assignment"}
                handleClick={() => {
                  onOpenSubmitModal();
                  setAssignment(row.row.original);
                }}
              />
            ) : row.row.original.status === "Submitted" &&
              row.row.original.grade ? ( // Check if grade exists
              <IconView
                label={"View feedback"}
                handleClick={() => {
                  onOpenFeedbackModal();
                  setAssignment(row.row.original);
                }}
              />
            ) : null}
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
      onCloseSubmitModal();
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
      {/*feedback modal*/}
      <Modal
        size={"xl"}
        isCentered={true}
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          onCloseFeedbackModal();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack alignItems={"stretch"}>
              <Text variant={"heading2"} color={"black"}>
                Feedback and grade
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
                <Textarea
                  value={assignment.feedback}
                  readOnly
                  _hover={{ cursor: "auto" }}
                />
              </VStack>
              <TextField
                value={assignment.grade}
                readOnly
                flex={1}
                label={"Grade (1-100)"}
              />
            </HStack>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      {/*submit modal*/}
      <Modal
        size={"xl"}
        isCentered={true}
        isOpen={isSubmitModalOpen}
        onClose={() => {
          onCloseSubmitModal();
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
              <InputGroup
                _hover={{ cursor: "pointer" }}
                onClick={() => inputRef.current.click()}
              >
                <InputLeftElement>
                  <LinkIcon color="black" />
                </InputLeftElement>
                <Input
                  readOnly
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
        thirdData={missedAssignments}
        firstTab={"Pending Assignments"}
        secondTab={"Submitted Assignments"}
        thirdTab={"Missed assignments"}
        columns={columns}
        isLoading={isLoading}
        hasThreeTabs={true}
      />
    </PanelLayout>
  );
};

export default MyAssignments;
