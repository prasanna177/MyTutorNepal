import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import colors from "../theme/colors";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import TextField from "../components/common/TextField";
import Password from "../components/common/Password";

const Login = () => {
  const schema = yup.object({
    email: yup
      .string()
      .required("Email address is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  console.log(errors);

  return (
    <Flex
      h={"100dvh"}
      bgColor={"gray.0"}
      justifyContent={"center"}
      alignItems={"center"}
    >
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
                <HStack width={"100%"} justifyContent={"space-between"}>
                  <Checkbox
                    _checked={{
                      "& .chakra-checkbox__control": {
                        background: colors.primary[0],
                        border: "none",
                      },
                    }}
                    iconColor="white"
                  >
                    <Text variant={"title1"}>Remember me</Text>
                  </Checkbox>
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
