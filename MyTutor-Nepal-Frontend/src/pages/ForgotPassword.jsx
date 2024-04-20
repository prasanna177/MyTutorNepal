import { useForm } from "react-hook-form";
import TextField from "../components/common/TextField";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/auth/forgot-password`,
        data
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
    <Flex h={"100dvh"} justifyContent={"center"} alignItems={"center"}>
      <Box
        boxShadow={"md"}
        borderRadius={"10px"}
        p={"30px"}
        maxWidth={"500px"}
        w={"100%"}
        bgColor={"white"}
      >
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack alignItems={"start"}>
            <VStack mb={5} alignItems={"start"}>
              <Text color={"primary.0"} fontSize={"2xl"} fontWeight={"bold"}>
                Find your account
              </Text>
              <Text color={"gray.100"} fontSize={"lg"}>
                Please enter your email or mobile number to search for your
                account.
              </Text>
            </VStack>
            <VStack alignItems={"start"} gap={3} w={"100%"}>
              <VStack alignItems={"start"} w={"100%"} gap={8}>
                <TextField
                  name={"email"}
                  errors={errors?.email?.message}
                  register={register}
                  placeholder={"Email"}
                />
                <HStack w={"100%"} justifyContent={"flex-end"}>
                  <Link to={"/"}>
                    <Button type="button">Cancel</Button>
                  </Link>
                  <Button
                    type="submit"
                    rightIcon={<ArrowRightIcon />}
                    _hover={{ opacity: 0.8 }}
                    _active={{}}
                    color={"white"}
                    bgColor={"primary.0"}
                  >
                    Search
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default ForgotPassword;
