import { Flex, Spinner } from "@chakra-ui/react";

const SpinnerComponenet = ({ bgColor }) => {
  return (
    <Flex
      minH={"100dvh"}
      alignItems={"center"}
      justifyContent={"center"}
      zIndex={"9999"}
      bgColor={bgColor}
    >
      <Spinner size={"xl"} />
    </Flex>
  );
};

export default SpinnerComponenet;
