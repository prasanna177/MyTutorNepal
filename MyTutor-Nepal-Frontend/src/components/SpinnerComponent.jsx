import { Flex, Spinner } from "@chakra-ui/react";

const SpinnerComponenet = () => {
  return (
    <Flex
      minH={"100dvh"}
      alignItems={"center"}
      justifyContent={"center"}
      zIndex={"9999"}
      bgColor={"opaque.0"}
    >
      <Spinner size={"xl"} />
    </Flex>
  );
};

export default SpinnerComponenet;
