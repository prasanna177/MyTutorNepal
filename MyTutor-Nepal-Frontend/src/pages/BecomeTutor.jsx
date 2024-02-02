import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import Layout from "../components/Layout/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import TextField from "../components/common/TextField";
import { DevTool } from "@hookform/devtools";
import toast from "react-hot-toast";
import { useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";

const BecomeTutor = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const schema = yup.object({
    fullName: yup.string().required("Full Name is required"),
    email: yup.string().required("Email address is required"),
    phone: yup.string().required("Phone number is required"),
    subjects: yup
      .array()
      .of(yup.string().required("Subject is required"))
      .test(
        "uniqueSubjects",
        "Subjects must be unique",
        (values) => new Set(values).size === values.length
      ),
  });

  const onSubmit = (data) => {
    console.log(data);
    console.log(errors);
  };

  const subjectsOptions = [
    "Math",
    "Science",
    "English",
    "History",
    "Programming",
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   subjects: [""],
    // },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "subjects",
    control,
  });

  if (fields.length === 0) {
    append("");
  }

  return (
    <Layout>
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          name={"fullName"}
          errors={errors?.fullName?.message}
          register={register}
          placeholder={"Full Name"}
        />
        <TextField
          name={"email"}
          errors={errors?.email?.message}
          register={register}
          placeholder={"Email"}
        />
        <TextField
          name={"phone"}
          errors={errors?.phone?.message}
          register={register}
          placeholder={"Phone number"}
        />
        {fields.map((field, index) => (
          <Box key={field.id}>
            <FormControl isInvalid={Boolean(errors?.subjects?.[index])}>
              <HStack>
                <Box>
                  <Select
                    name={`subjects[${index}]`}
                    placeholder="Select a subject"
                    {...register(`subjects[${index}]`)}
                  >
                    {subjectsOptions.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.subjects?.[index]?.message}
                  </FormErrorMessage>
                </Box>

                {index > 0 && (
                  <CloseIcon
                    boxSize={3}
                    _hover={{cursor: "pointer"}}
                    type="button"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </CloseIcon>
                )}
              </HStack>
            </FormControl>
          </Box>
        ))}
        <Button type="button" onClick={() => append("")}>
          Add Subject
        </Button>
        <Button type="submit">Submit</Button>
      </Box>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{errors.subjects?.message}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      <DevTool control={control} />
    </Layout>
  );
};

export default BecomeTutor;
