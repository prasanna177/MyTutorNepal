import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Select,
  Heading,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { CloseIcon } from "@chakra-ui/icons";
import toast from "react-hot-toast";
import {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PanelLayout from "../../components/Layout/PanelLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import TextField from "../../components/common/TextField";
import PlaceAutocomplete from "../../components/PlaceAutocomplete";

const Profile = () => {
  const [tutor, setTutor] = useState(null);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    feePerClass: yup
      .number()
      .typeError("Please enter a valid number")
      .positive("Please enter a positive number")
      .required("Please enter fee per class"),
    timing: yup.object().shape({
      startTime: yup.string().required("Start Time is required"),
      endTime: yup.string().required("End Time is required"),
    }),
  });

  const onSubmit = async (data) => {
    const submissionData = { ...data, coordinates, address, userId: user._id };
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:4000/api/tutor/updateProfile",
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
  const subjectsOptions = [
    "Math",
    "Science",
    "English",
    "History",
    "Programming",
  ];

  console.log(tutor, "sss");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: tutor?.fullName || "",
      email: tutor?.email || "",
      phone: tutor?.phone || "",
      feePerClass: tutor?.feePerClass || "",
      timing: {
        startTime: tutor?.timing?.startTime || "",
        endTime: tutor?.timing?.endTime || "",
      },
      subjects: tutor?.subjects || [""],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "subjects",
    control,
  });

  if (fields.length === 0) {
    append("");
  }

  const params = useParams();

  const getTutorInfo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/tutor/getTutorInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setTutor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTutorInfo();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Set default values after getting tutor information
    setValue("fullName", tutor?.fullName || "");
    setValue("email", tutor?.email || "");
    setValue("phone", tutor?.phone || "");
    setValue("feePerClass", tutor?.feePerClass || "");
    setValue("timing.startTime", tutor?.timing?.startTime || "");
    setValue("timing.endTime", tutor?.timing?.endTime || "");
    setValue("subjects", tutor?.subjects || [""]);
    setAddress(tutor?.address);
    setCoordinates(tutor?.coordinates);
  }, [tutor, setValue]);

  return (
    <PanelLayout>
      <Heading>Manage profile</Heading>
      {tutor && (
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
            <PlaceAutocomplete
              address={address}
              setAddress={setAddress}
              handleSelect={handleSelect}
              setCoordinates={setCoordinates}
            />
          <Button type="submit">Submit</Button>
        </Box>
      )}
    </PanelLayout>
  );
};

export default Profile;
