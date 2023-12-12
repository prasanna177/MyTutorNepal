import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";

const Password = ({ register, name, errors, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isInvalid={Boolean(errors)}>
      <InputGroup>
        <Input 
          type={showPassword ? "text" : "password"}
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
  );
};

export default Password;
