import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import Layout from "../components/Layout/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import TextField from "../components/common/TextField";
import { CloseIcon } from "@chakra-ui/icons";
import toast from "react-hot-toast";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useState } from "react";

const BecomeTutor = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0])
    setAddress(value);
    setCoordinates(ll);
  };
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
    feePerClass: yup
      .number()
      .typeError("Please enter a valid number")
      .positive("Please enter a positive number")
      .required("Please enter fee per class"),
      address: yup.string().required("Please enter a proper address"),
  }); 

  const onSubmit = async (data) => {
    try {
      console.log({...data, coordinates});
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
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
                    _hover={{ cursor: "pointer" }}
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
        <TextField
          name={"feePerClass"}
          errors={errors?.feePerClass?.message}
          register={register}
          placeholder={"Fee Per Class"}
        />
        <Input type="time" {...register("timing.startTime")} />
        <Input type="time" {...register("timing.endTime")} />
        <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            
<FormControl isInvalid={Boolean(errors?.address)}>
            <Input
              {...register('address')}
              {...getInputProps({
                placeholder: 'Search Places ...',
              })}
            />
                  {errors && <FormErrorMessage>{errors.address?.message}</FormErrorMessage>}
    </FormControl>
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion,index) => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div key = {index}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
        <Button type="submit">Submit</Button>
      </Box>
    </Layout>
  );
};

export default BecomeTutor;
