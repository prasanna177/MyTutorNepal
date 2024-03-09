import { Text, VStack } from "@chakra-ui/react";

const Bundle = ({ title, subtitle }) => {
  return (
    <VStack alignItems={"start"}>
      <Text variant={"title2"}>{title}</Text>
      <Text variant={"subtitle1"}>{subtitle}</Text>
    </VStack>
  );
};

export default Bundle;
