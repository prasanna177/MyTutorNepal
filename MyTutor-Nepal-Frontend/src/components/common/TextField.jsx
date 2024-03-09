import {
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

const TextField = ({
  name,
  errors,
  register,
  placeholder,
  type,
  label,
  hasLabel,
}) => {
  return (
    <VStack alignItems={"start"} w={"100%"}>
      <Text variant={"subtitle1"}>
        {hasLabel && <span style={{ color: "red" }}>* </span>}
        {label}
      </Text>
      <FormControl isInvalid={Boolean(errors)}>
        <Input type={type} {...register(name)} placeholder={placeholder} />
        {errors && <FormErrorMessage>{errors}</FormErrorMessage>}
      </FormControl>
    </VStack>
  );
};

export default TextField;
