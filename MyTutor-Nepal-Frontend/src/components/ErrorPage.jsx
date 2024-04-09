// Error page

import { Box, Container, Flex, Image, Text } from "@chakra-ui/react";
import NoData from "../assets/images/NoData.png";
import NormalButton from "./common/Button";

const ErrorPage = ({ error, resetErrorBoundary }) => {
  return (
    <Container>
      <Flex justifyContent={"center"}>
        <Flex direction={"column"} justifyContent={"center"} height={"80vh"}>
          <Image src={NoData} />
          <Box>
            <Text textAlign={"center"} fontSize={"32px"}>
              {error.message}
            </Text>
            <Flex justifyContent={"center"}>
              <NormalButton
                color={"white"}
                bgColor={"primary.0"}
                text={"Go back"}
                onClick={() => {
                  window.history.back();
                  resetErrorBoundary();
                }}
              />
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
};

export default ErrorPage;
