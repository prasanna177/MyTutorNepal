import { Box, Flex, VStack } from "@chakra-ui/react";
import PanelLayout from "../components/Layout/PanelLayout";
import Password from "../components/common/Password";
import NormalButton from "../components/common/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const schema = yup.object({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup
      .string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters long"),
    reEnteredPassword: yup
      .string()
      .required("Please type your password")
      .oneOf([yup.ref("newPassword")], "Passwords do not match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/auth/change-password`,
        { ...data, userId: user._id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      const { success, message } = response.data;
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (err) {
      dispatch(hideLoading());
      console.log(err);
      toast.error("Something went wrong");
    }
  };
  return (
    <PanelLayout title="Change password">
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          name="username"
          autoComplete="username email"
          style={{ display: "none" }}
          aria-hidden="true"
        />
        <VStack gap={7} alignItems={"stretch"}>
          <Password
            width={"500px"}
            register={register}
            label={"Enter old password"}
            autocomplete="new-password"
            name={"oldPassword"}
            errors={errors?.oldPassword?.message}
            placeholder={"Old Password"}
          />
          <Password
            width={"500px"}
            register={register}
            label={"Enter new password"}
            autocomplete="new-password"
            name={"newPassword"}
            errors={errors?.newPassword?.message}
            placeholder={"New Password"}
          />
          <Password
            width={"500px"}
            register={register}
            label={"Re-enter new password"}
            autocomplete="new-password"
            name={"reEnteredPassword"}
            errors={errors?.reEnteredPassword?.message}
            placeholder={"Re-Enter password"}
          />
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

export default ChangePassword;
