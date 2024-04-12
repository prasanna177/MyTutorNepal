// Error page

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import VerifySuccess from "../assets/images/VerifySuccess.png";

const VerifyMessage = () => {
  return (
    <Flex justifyContent={"center"}>
      <Flex
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Image w={"500px"} src={VerifySuccess} />
        <Box>
          <Text variant={"subtitle1"}>Email Verified Successfully</Text>
          <Text variant={"subtitle1"}>You may close this page</Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default VerifyMessage;
