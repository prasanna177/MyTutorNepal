import { Box, Image, Text, VStack } from "@chakra-ui/react";
import NoAccess from "../assets/images/NoAccess.png";
import NormalButton from "../components/common/Button";

const AccessDenied = () => {
  return (
    <Box fontSize={"14px"} fontWeight={500} color={"gray.400"}>
      <VStack justifyContent="center" alignItems="center" height="100%">
        <Image h={"400px"} src={NoAccess} />
        <Text variant={"subtitle1"}>
          The owners have allowed access to this content to a limited group of
        people
        </Text>
        <Text variant={"overline"}>Access denied</Text>
        <NormalButton
          color={"white"}
          bgColor={"primary.0"}
          text={"Go back"}
          onClick={() => window.history.back()}
        />
      </VStack>
    </Box>
  );
};

export default AccessDenied;
