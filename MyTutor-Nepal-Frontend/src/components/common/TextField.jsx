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
  disabled,
  label,
  hasLabel,
  isNotRequired,
  width,
}) => {
  return (
    <VStack alignItems={"start"}>
      <Text variant={"subtitle1"}>
        {hasLabel && !isNotRequired && <span style={{ color: "red" }}>* </span>}
        {label}
      </Text>
      <FormControl isInvalid={Boolean(errors)}>
        <Input
          maxW={width}
          disabled={disabled}
          type={type}
          {...register(name)}
          placeholder={placeholder}
        />
        {errors && <FormErrorMessage>{errors}</FormErrorMessage>}
      </FormControl>
    </VStack>
  );
};

export default TextField;
