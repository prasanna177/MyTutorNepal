import { Box, Flex, VStack } from "@chakra-ui/react";
import PanelLayout from "../components/Layout/PanelLayout";
import Password from "../components/common/Password";
import NormalButton from "../components/common/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const ChangePassword = () => {
  const schema = yup.object({
    oldPassword: yup.string().required("Full name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {};
  return (
    <PanelLayout title="Change password">
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={7} alignItems={"stretch"}>
          <Password
            register={register}
            label={"Enter old password"}
            autocomplete="new-password"
            name={"oldPassword"}
            errors={errors?.oldPassword?.message}
            placeholder={"Password"}
          />
          <Password
            register={register}
            label={"Enter new password"}
            autocomplete="new-password"
            name={"newPassword"}
            errors={errors?.newPassword?.message}
            placeholder={"Password"}
          />
          <Password
            register={register}
            label={"Re-enter new password"}
            autocomplete="new-password"
            name={"reEnteredPassword"}
            errors={errors?.reEnteredPassword?.message}
            placeholder={"Password"}
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
