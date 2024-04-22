import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import TextField from "../components/common/TextField";
import Password from "../components/common/Password";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schema = yup.object({
    email: yup.string().required("Email address is required"),
    password: yup.string().required("Password is required"),
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
        `${import.meta.env.VITE_SERVER_PORT}/api/auth/login`,
        data
      );
      dispatch(hideLoading());
      const { success, message } = response.data;
      if (success) {
        window.location.reload();
        toast.success(message);
        localStorage.setItem("token", response.data.token);
        navigate("/");
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
        maxWidth={"400px"}
        w={"100%"}
        bgColor={"white"}
      >
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack alignItems={"start"}>
            <VStack mb={5} alignItems={"start"}>
              <Text color={"primary.0"} fontSize={"3xl"} fontWeight={"bold"}>
                Welcome back!
              </Text>
              <Text color={"gray.100"} fontSize={"lg"}>
                Log in to your account
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
                <Password
                  register={register}
                  name={"password"}
                  placeholder={"Password"}
                  errors={errors?.password?.message}
                />
                <HStack width={"100%"} justifyContent={"end"}>
                  <Text color={"primary.0"} fontSize={"md"}>
                    <Link to={"/forgot-password"}>Forgot password?</Link>
                  </Text>
                </HStack>
                <Button
                  type="submit"
                  rightIcon={<ArrowRightIcon />}
                  _hover={{ opacity: 0.8 }}
                  _active={{}}
                  color={"white"}
                  bgColor={"primary.0"}
                  w={"100%"}
                >
                  Login
                </Button>
              </VStack>
              <Text variant={"title1"}>
                Don&apos;t have an account?{" "}
                <Link fontSize={"xl"} to={"/signup"}>
                  {" "}
                  <Text
                    color={"primary.0"}
                    _hover={{ textDecoration: "underline" }}
                    as={"span"}
                  >
                    Sign up here
                  </Text>
                </Link>
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
