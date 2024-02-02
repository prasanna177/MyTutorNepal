import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import Layout from "../components/Layout/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import TextField from "../components/common/TextField";

const BecomeTutor = () => {
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
    defaultValues: {
      subjects: [""],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "subjects",
    control,
  });

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

              {index > 0 && (
                <Button type="button" onClick={() => remove(index)}>
                  Remove
                </Button>
              )}
            </FormControl>
          </Box>
        ))}
        <Button type="button" onClick={() => append({})}>
          Add Subject
        </Button>
        <Button type="submit">Submit</Button>
      </Box>
    </Layout>
  );
};

export default BecomeTutor;
