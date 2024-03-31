import {
  Box,
  Flex,
  Grid,
  HStack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import TextField from "../components/common/TextField";
import { CloseIcon } from "@chakra-ui/icons";
import toast from "react-hot-toast";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import PanelLayout from "../components/Layout/PanelLayout";
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import NormalButton from "../components/common/Button";
import ImageInput from "../components/common/ImageInput";

const BecomeTutor = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [profilePicImage, setProfilePicImage] = useState("");
  const [nIdFrontImage, setNIdFrontImage] = useState("");
  const [nIdBackImage, setNIdBackImage] = useState("");
  const [teachingCertificateImage, setTeachingCertificateImage] = useState("");

  console.log(profilePicImage, "pp");

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
    data.profilePicUrl = profilePicImage;
    data.nIdFrontUrl = nIdFrontImage;
    data.nIdBackUrl = nIdBackImage;
    data.teachingCertificateUrl = teachingCertificateImage;
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
      //jugaad
      const filePathUrl = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/saveFilePath`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(filePathUrl, "fpu");
      filePathUrl.data.data.forEach((file) => {
        const { fieldname, path } = file;

        // Update the corresponding URL in submissionData
        submissionData[fieldname] = path;
      });
      console.log(submissionData, "sdsd");
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/become-tutor`,
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
    setValue,
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

  const handleImageChange = (e, setImage) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    // Set default values after getting tutor information
    setValue("phone", user?.phone || "");
    setAddress(user?.address || "");
    setCoordinates(
      user?.coordinates || {
        lat: null,
        lng: null,
      }
    );
  }, [user, setValue]);

  return (
    <PanelLayout title={"Become tutor"}>
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
                    address={address}
                    setAddress={setAddress}
                    handleSelect={handleSelect}
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
                <Grid templateColumns="repeat(3, 1fr)" gap={"16px"}>
                  {fields.map((field, index) => (
                    <React.Fragment key={field.id}>
                      <TextField
                        name={`teachingInfo[${index}].subject`}
                        errors={errors.teachingInfo?.[index]?.subject?.message}
                        register={register}
                        placeholder={"Select a subject"}
                        label={"Subject"}
                        hasLabel={true}
                      />
                      <TextField
                        name={`teachingInfo[${index}].price`}
                        errors={errors.teachingInfo?.[index]?.price?.message}
                        register={register}
                        placeholder={"Enter rate per class for this subject"}
                        label={"Price"}
                        hasLabel={true}
                      />
                      <HStack>
                        <Box width={"100%"}>
                          <TextField
                            name={`teachingInfo[${index}].proficiency`}
                            errors={
                              errors.teachingInfo?.[index]?.proficiency?.message
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
              <Text variant={"heading2"}>Submit your documents here</Text>
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
                text={"Submit"}
                type="submit"
                px={20}
              />
            </Flex>
          </VStack>
        </Box>
      </Box>
    </PanelLayout>
  );
};

export default BecomeTutor;
