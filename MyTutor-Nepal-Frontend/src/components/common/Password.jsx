import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const Password = ({ register, name, errors, placeholder, autocomplete, label }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <VStack alignItems={"start"}>
      <Text variant={"subtitle1"}>
        {label}
      </Text>
      <FormControl isInvalid={Boolean(errors)}>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete={autocomplete}
            {...register(name)}
            focusBorderColor="black"
            placeholder={placeholder}
          />
          <InputRightElement
            sx={{
              _hover: {
                cursor: "pointer",
              },
            }}
            onClick={() => setShowPassword((showPassword) => !showPassword)}
          >
            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </InputRightElement>
        </InputGroup>
        {errors && <FormErrorMessage>{errors}</FormErrorMessage>}
      </FormControl>
    </VStack>
  );
};

export default Password;
