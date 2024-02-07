import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react";

const TextField = ({ name, errors, register, placeholder, type }) => {
  return (
    <FormControl isInvalid={Boolean(errors)}>
      <Input type={type} {...register(name)} placeholder={placeholder} />
      {errors && <FormErrorMessage>{errors}</FormErrorMessage>}
    </FormControl>
  );
};

export default TextField;
