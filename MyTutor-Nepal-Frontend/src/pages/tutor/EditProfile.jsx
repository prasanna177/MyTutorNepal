import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  HStack,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { CloseIcon } from "@chakra-ui/icons";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import PanelLayout from "../../components/Layout/PanelLayout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import TextField from "../../components/common/TextField";
import PlaceAutocomplete from "../../components/PlaceAutocomplete";
import NormalButton from "../../components/common/Button";
import ImageInput from "../../components/common/ImageInput";
import { subjectCategories } from "../../data/subjectCategories";

const EditProfile = () => {
  const [tutor, setTutor] = useState(null);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [profilePicImage, setProfilePicImage] = useState("");
  const [nIdFrontImage, setNIdFrontImage] = useState("");
  const [nIdBackImage, setNIdBackImage] = useState("");
  const [teachingCertificateImage, setTeachingCertificateImage] = useState("");

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(coordinates);
  console.log(address)

  const schema = yup.object({
    fullName: yup.string().required("Full name is required"),
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
          category: yup.string().required("Category is required"),
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
    data.profilePicUrl = profilePicImage;
    data.nIdFrontUrl = nIdFrontImage;
    data.nIdBackUrl = nIdBackImage;
    data.teachingCertificateUrl = teachingCertificateImage;
    const submissionData = { ...data, coordinates, address, userId: user._id };
    const formData = new FormData();
    formData.append("profilePicUrl", submissionData.profilePicUrl);
    formData.append("nIdFrontUrl", submissionData.nIdFrontUrl);
    formData.append("nIdBackUrl", submissionData.nIdBackUrl);
    formData.append(
      "teachingCertificateUrl",
      submissionData.teachingCertificateUrl
    );
    //jugaad
    const filePathUrl = await axios.post(
      `${import.meta.env.VITE_SERVER_PORT}/api/uploader/saveFilePath`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    filePathUrl.data.data.forEach((file) => {
      const { fieldname, path } = file;

      // Update the corresponding URL in submissionData
      submissionData[fieldname] = path;
    });
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/tutor/updateProfile`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        navigate(`/tutor/profile/${params.id}`);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleImageChange = (e, setImage) => {
    setImage(e.target.files[0]);
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "teachingInfo",
    control,
  });

  const params = useParams();

  const getTutorInfo = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/tutor/getTutorInfo`,
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
    setValue("bio", tutor?.bio || "");
    setValue("timing.startTime", tutor?.timing?.startTime || "");
    setValue("timing.endTime", tutor?.timing?.endTime || "");
    // tutor?.teachingInfo.forEach((info, index) => {
    //   setValue(`teachingInfo[${index}].subject`, info.subject || "");
    //   setValue(`teachingInfo[${index}].price`, info.price || "");
    //   setValue(`teachingInfo[${index}].proficiency`, info.proficiency || "");
    // });
    setAddress(tutor?.address);
    setCoordinates(tutor?.coordinates);
    setProfilePicImage(tutor?.profilePicUrl || "");
    setNIdFrontImage(tutor?.nIdFrontUrl || "");
    setNIdBackImage(tutor?.nIdBackUrl || "");
    setTeachingCertificateImage(tutor?.teachingCertificateUrl || "");

    //jugad
    if (!tutor?.teachingInfo || tutor.teachingInfo.length === 0) {
      append({});
    } else {
      tutor?.teachingInfo.forEach((info, index) => {
        setValue(`teachingInfo[${index}].subject`, info.subject || "");
        setValue(`teachingInfo[${index}].category`, info.category || "");
        setValue(`teachingInfo[${index}].price`, info.price || "");
        setValue(`teachingInfo[${index}].proficiency`, info.proficiency || "");
      });
    }
  }, [tutor, setValue, append]);

  return (
    <PanelLayout title={"Edit profile"}>
      {tutor && (
        <Box>
          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
          >
            <VStack alignItems={"stretch"} gap={"30px"}>
              <VStack gap={7} alignItems={"stretch"}>
                <Text variant={"heading2"}>Personal Information</Text>
                <ImageInput
                  width={"200px"}
                  height={"200px"}
                  text={"Enter your photo here"}
                  image={profilePicImage}
                  handleImageChange={(e) =>
                    handleImageChange(e, setProfilePicImage)
                  }
                  isProfileImg={true}
                />
                <Grid templateColumns="repeat(3, 1fr)" gap={"16px"}>
                  <TextField
                    name={"fullName"}
                    errors={errors?.fullName?.message}
                    register={register}
                    placeholder={"Full name"}
                    label={"Full name"}
                    hasLabel={true}
                  />
                  <TextField
                    name={"phone"}
                    errors={errors?.phone?.message}
                    register={register}
                    placeholder={"Phone number"}
                    label={"Phone number"}
                    hasLabel={true}
                  />
                  <VStack alignItems={"stretch"}>
                    <Text variant={"subtitle1"}>
                      <span style={{ color: "red" }}>* </span>
                      Enter your location
                    </Text>
                    <PlaceAutocomplete
                      isBecomeTutor={true}
                      address={address}
                      setAddress={setAddress}
                      setCoordinates={setCoordinates}
                    />
                  </VStack>
                  <VStack alignItems={"stretch"}>
                    <Text variant={"subtitle1"}>Bio</Text>
                    <Textarea
                      {...register("bio")}
                      placeholder={"Write a short description about yourself"}
                    />
                  </VStack>
                </Grid>
              </VStack>

              <VStack gap={7} alignItems={"stretch"}>
                <Text variant={"heading2"}>Services</Text>
                <Box>
                  <Grid templateColumns="repeat(4, 1fr)" gap={"16px"}>
                    {fields?.map((field, index) => (
                      <React.Fragment key={field.id}>
                        <TextField
                          name={`teachingInfo[${index}].subject`}
                          errors={
                            errors.teachingInfo?.[index]?.subject?.message
                          }
                          register={register}
                          placeholder={"Select a subject"}
                          label={"Subject"}
                          hasLabel={true}
                        />
                        <VStack alignItems={"start"} w={"100%"}>
                          <Text variant={"subtitle1"}>
                            <span style={{ color: "red" }}>* </span>
                            Category
                          </Text>
                          <FormControl
                            isInvalid={Boolean(
                              errors.teachingInfo?.[index]?.category?.message
                            )}
                          >
                            <Select
                              {...register(`teachingInfo[${index}].category`)}
                              placeholder={"Select category for this subject"}
                            >
                              {subjectCategories.map((item) => (
                                <option key={item.id} value={item.category}>
                                  {item.category}
                                </option>
                              ))}
                            </Select>
                            {errors && (
                              <FormErrorMessage>
                                {
                                  errors.teachingInfo?.[index]?.category
                                    ?.message
                                }
                              </FormErrorMessage>
                            )}
                          </FormControl>
                        </VStack>
                        <TextField
                          name={`teachingInfo[${index}].price`}
                          errors={errors.teachingInfo?.[index]?.price?.message}
                          register={register}
                          placeholder={"Enter rate per class for this subject"}
                          label={"Price per lesson"}
                          hasLabel={true}
                        />
                        <HStack>
                          <Box width={"100%"}>
                            <TextField
                              name={`teachingInfo[${index}].proficiency`}
                              errors={
                                errors.teachingInfo?.[index]?.proficiency
                                  ?.message
                              }
                              register={register}
                              placeholder={
                                "Write your proficiency for this subject"
                              }
                              label={"Proficiency"}
                              hasLabel={true}
                            />
                          </Box>
                          {index > 0 && (
                            <CloseIcon
                              mt={2}
                              boxSize={5}
                              color={"red.600"}
                              _hover={{ cursor: "pointer" }}
                              type="button"
                              onClick={() => remove(index)}
                            />
                          )}
                        </HStack>
                      </React.Fragment>
                    ))}
                  </Grid>
                  <NormalButton
                    mt={"10px"}
                    bgColor={"primary.100"}
                    text={"Add subject"}
                    color={"primary.0"}
                    type="button"
                    onClick={() => append("")}
                  />
                </Box>
              </VStack>

              <VStack gap={7} alignItems={"stretch"}>
                <Text variant={"heading2"}>Timings</Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={"16px"}>
                  <TextField
                    type={"time"}
                    name={"timing.startTime"}
                    errors={errors?.timing?.startTime?.message}
                    register={register}
                    placeholder={"Start time"}
                    label={"Start time"}
                    hasLabel={true}
                  />
                  <TextField
                    type={"time"}
                    name={"timing.endTime"}
                    errors={errors?.timing?.endTime?.message}
                    register={register}
                    placeholder={"End time"}
                    label={"End time"}
                    hasLabel={true}
                  />
                </Grid>
              </VStack>

              <VStack gap={7} alignItems={"stretch"}>
                <Text variant={"heading2"}>Your documents</Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={"16px"}>
                  <ImageInput
                    text={"National ID (Front)"}
                    image={nIdFrontImage}
                    handleImageChange={(e) =>
                      handleImageChange(e, setNIdFrontImage)
                    }
                    isProfileImg={false}
                  />
                  <ImageInput
                    text={"National ID (Back)"}
                    image={nIdBackImage}
                    handleImageChange={(e) =>
                      handleImageChange(e, setNIdBackImage)
                    }
                    isProfileImg={false}
                  />
                  <ImageInput
                    text={"Highest education/teaching certificate"}
                    image={teachingCertificateImage}
                    handleImageChange={(e) =>
                      handleImageChange(e, setTeachingCertificateImage)
                    }
                    isProfileImg={false}
                  />
                </Grid>
              </VStack>
              <Flex w={"100%"} justifyContent={"center"}>
                <NormalButton
                  color={"white"}
                  bgColor={"primary.0"}
                  text={"Save"}
                  type="submit"
                  px={20}
                />
              </Flex>
            </VStack>
          </Box>
        </Box>
      )}
    </PanelLayout>
  );
};

export default EditProfile;
