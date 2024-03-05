import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const API_KEY = "b67402f59aa24b6ea5b2b5b7309a6d66";
const apiEndpoint = "https://api.opencagedata.com/geocode/v1/json";

const BecomeTutor = () => {
  // const [profilePicUrl, setProfilePicUrl] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    timing: yup.object().shape({
      startTime: yup.string().required("Start Time is required"),
      endTime: yup.string().required("End Time is required"),
    }),
    teachingInfo: yup
      .array()
      .of(
        yup.object().shape({
          subject: yup.string().required("Subject is required"),
          price: yup
            .number()
            .typeError("Please enter a valid number")
            .positive("Please enter a positive number")
            .required("Please enter the price"),
          proficiency: yup.string().required("Proficiency is required"),
        })
      )
      .required("At least one teaching information is required"),
  });

  const onSubmit = async (data) => {
    data.profilePicUrl = data.profilePicUrl[0];
    data.nIdFrontUrl = data.nIdFrontUrl[0];
    data.nIdBackUrl = data.nIdBackUrl[0];
    data.teachingCertificateUrl = data.teachingCertificateUrl[0];
    const submissionData = { ...data, coordinates, address, userId: user._id };
    try {
      const formData = new FormData();
      formData.append("profilePicUrl", submissionData.profilePicUrl);
      formData.append("nIdFrontUrl", submissionData.nIdFrontUrl);
      formData.append("nIdBackUrl", submissionData.nIdBackUrl);
      formData.append(
        "teachingCertificateUrl",
        submissionData.teachingCertificateUrl
      );
      const filePathUrl = await axios.post(
        "http://localhost:4000/api/user/saveFilePath",
        formData
      );
      filePathUrl.data.data.forEach((file) => {
        const { fieldname, path } = file;

        // Update the corresponding URL in submissionData
        submissionData[fieldname] = path;
      });
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:4000/api/user/become-tutor",
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teachingInfo: [{ subject: "", price: 0, proficiency: "" }],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "teachingInfo",
    control,
  });

  // if (fields.length === 0) {
  //   append("");
  // }

  return (
    <Layout>
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        enctype="multipart/form-data"
      >
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
            <HStack>
              <HStack>
                <FormControl
                  isInvalid={Boolean(errors?.teachingInfo?.[index]?.subject)}
                >
                  <Input
                    name={`teachingInfo[${index}].subject`}
                    placeholder="Select a subject"
                    {...register(`teachingInfo.${index}.subject`)}
                  />
                  <FormErrorMessage>
                    {errors.teachingInfo?.[index]?.subject?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={Boolean(errors?.teachingInfo?.[index]?.price)}
                >
                  <Input
                    name={`teachingInfo[${index}].price`}
                    placeholder="Enter rate per class for this subject"
                    {...register(`teachingInfo.${index}.price`)}
                  />
                  <FormErrorMessage>
                    {errors.teachingInfo?.[index]?.price?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={Boolean(
                    errors?.teachingInfo?.[index]?.proficiency
                  )}
                >
                  <Input
                    name={`teachingInfo[${index}].proficiency`}
                    placeholder="Write your proficiency for this subject"
                    {...register(`teachingInfo.${index}.proficiency`)}
                  />
                  <FormErrorMessage>
                    {errors.teachingInfo?.[index]?.proficiency?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>

              {index > 0 && (
                <CloseIcon
                  boxSize={3}
                  _hover={{ cursor: "pointer" }}
                  type="button"
                  onClick={() => remove(index)}
                />
              )}
            </HStack>
          </Box>
        ))}
        <Button type="button" onClick={() => append("")}>
          Add Subject
        </Button>
        <TextField
          type={"time"}
          name={"timing.startTime"}
          errors={errors?.timing?.startTime?.message}
          register={register}
          placeholder={"Start time"}
        />
        <TextField
          type={"time"}
          name={"timing.endTime"}
          errors={errors?.timing?.endTime?.message}
          register={register}
          placeholder={"End time"}
        />
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
                  const address = await getUserCurrentAddress(
                    latitude,
                    longitude
                  );
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
        <Input {...register("profilePicUrl")} type="file" accept="image/*" />
        <Input {...register("nIdFrontUrl")} type="file" accept="image/*" />
        <Input {...register("nIdBackUrl")} type="file" accept="image/*" />
        <Input
          {...register("teachingCertificateUrl")}
          type="file"
          accept="image/*"
        />
        <Button type="submit">Submit</Button>
      </Box>
    </Layout>
  );
};

export default BecomeTutor;