import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "../components/common/TextField";
import Password from "../components/common/Password";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const schema = yup.object({
    fullName: yup.string().required("Full name is required"),
    email: yup
      .string()
      .required("Email address is required")
      .matches(emailRegex, "Email address is not valid"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: yup
      .string()
      .required("Please type your password")
      .oneOf([yup.ref("password")], "Passwords do not match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/auth/signup`,
        data
      );
      dispatch(hideLoading());
      const { success, message } = response.data;
      if (success) {
        toast.success(message);
        navigate("/login");
      } else {
        toast.error(message);
      }
    } catch (error) {
      dispatch(hideLoading());
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
          {" "}
          {/* this is the form */}
          <VStack alignItems={"start"}>
            <VStack mb={5} alignItems={"start"}>
              <Text color={"primary.0"} fontSize={"3xl"} fontWeight={"bold"}>
                Join us today!
              </Text>
              <Text color={"gray.100"} fontSize={"lg"}>
                Create an account
              </Text>
            </VStack>

            {/*Input fields */}
            <VStack alignItems={"start"} w={"100%"} gap={6}>
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
              <Password
                register={register}
                name={"password"}
                errors={errors?.password?.message}
                placeholder={"Password"}
              />
              <Password
                register={register}
                name={"confirmPassword"}
                errors={errors?.confirmPassword?.message}
                placeholder={"Confirm password"}
              />
            </VStack>
            <VStack mt={4} gap={4} alignItems={"start"} w={"100%"}>
              <Button
                type="submit"
                rightIcon={<ArrowRightIcon />}
                _hover={{ opacity: 0.8 }}
                _active={{}}
                color={"white"}
                bgColor={"primary.0"}
                w={"100%"}
              >
                Sign up
              </Button>
              <Text color={"gray.100"} fontSize={"md"}>
                Already have an account?{" "}
                <Link fontSize={"xl"} to={"/login"}>
                  <Text
                    color={"primary.0"}
                    _hover={{ textDecoration: "underline" }}
                    as={"span"}
                  >
                    Log in here
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

export default Signup;
