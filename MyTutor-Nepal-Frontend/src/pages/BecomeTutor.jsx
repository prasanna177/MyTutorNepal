import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Select,
  Text,
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
import axios from "axios";

const BecomeTutor = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const API_KEY = "b67402f59aa24b6ea5b2b5b7309a6d66";
  const apiEndpoint = "https://api.opencagedata.com/geocode/v1/json";

  const getUserCurrentAddress = async (lat, lng) => {
    let query = `${lat},${lng}`;
    let apiUrl = `${apiEndpoint}?key=${API_KEY}&q=${query}&pretty=1`;
    try {
      const res = await axios.get(apiUrl);
      return res.data.results[0].formatted;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
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
    // address: yup.string().required("Please enter a proper address"),
  });

  const onSubmit = async (data) => {
    try {
      console.log({ ...data, coordinates, address });
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
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <Box>
              <FormControl isInvalid={Boolean(errors?.address)}>
                <Input
                  {...getInputProps({
                    placeholder: "Search Places ...",
                  })}
                />
              </FormControl>
              <Box>
                {loading && <Box>Loading...</Box>}
                {suggestions.map((suggestion, index) => {
                  return (
                    <Box
                      w={"500px"}
                      h={"60px"}
                      bgColor={"red.200"}
                      borderBottom={"1px"}
                      key={index}
                      {...getSuggestionItemProps(suggestion, {})}
                    >
                      <Text color={"red"}>{suggestion.description}</Text>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </PlacesAutocomplete>
        <Button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  const { latitude, longitude } = position.coords;
                  const cords = {
                    lat: latitude,
                    lng: longitude,
                  };
                  const address = await getUserCurrentAddress(latitude, longitude);
                  setAddress(address);
                  setCoordinates(cords);
                },
                (error) => {
                  console.log(error);
                }
              );
            }
          }}
        >
          Add location
        </Button>
        <Button type="submit">Submit</Button>
      </Box>
    </Layout>
  );
};

export default BecomeTutor;
