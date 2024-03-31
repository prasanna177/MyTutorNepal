import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "../components/common/TextField";
import { useForm } from "react-hook-form";
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import PanelLayout from "../components/Layout/PanelLayout";
import NormalButton from "../components/common/Button";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const dispatch = useDispatch();
  const params = useParams();

  const getUserInfo = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/getUserById`,
        { clientId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const schema = yup.object({
    fullName: yup.string().required("Full name is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getUserInfo();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Set default values after getting tutor information
    setValue("fullName", user?.fullName || "");
    setValue("email", user?.email || "");
    setValue("phone", user?.phone || "");
    setAddress(user?.address);
    setCoordinates(user?.coordinates);
  }, [user, setValue]);

  const onSubmit = async (data) => {
    const submissionData = { ...data, address, coordinates, userId: user._id };
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/update-profile`,
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
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <PanelLayout title={"Profile"}>
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={7} alignItems={"stretch"}>
          <Text variant={"heading2"}>Edit profile</Text>
          <TextField
            width={"500px"}
            name={"fullName"}
            errors={errors?.fullName?.message}
            register={register}
            placeholder={"Full name"}
            label={"Full name"}
            hasLabel={true}
          />
          <TextField
            disabled={true}
            width={"500px"}
            name={"email"}
            register={register}
            placeholder={"Email"}
            label={"Email"}
            hasLabel={true}
          />
          <TextField
            name={"phone"}
            width={"500px"}
            register={register}
            placeholder={"Phone number"}
            label={"Phone number"}
            hasLabel={true}
            isNotRequired={true}
          />
          <VStack alignItems={"stretch"}>
            <Text variant={"subtitle1"}>Enter your location</Text>
            <PlaceAutocomplete
              width={"500px"}
              address={address}
              setAddress={setAddress}
              setCoordinates={setCoordinates}
            />
          </VStack>
        </VStack>
        <Flex mt={5} w={"100%"} justifyContent={"start"}>
          <NormalButton
            color={"white"}
            bgColor={"primary.0"}
            text={"Save"}
            type="submit"
            px={20}
          />
        </Flex>
      </Box>
    </PanelLayout>
  );
};

export default UserProfile;
