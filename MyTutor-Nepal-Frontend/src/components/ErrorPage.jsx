// Error page

import { Box, Button, Container, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NoData from "../assets/images/NoData.png";

const ErrorPage = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
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
              <Button
                onClick={() => {
                  navigate("/");
                  resetErrorBoundary();
                }}
              >
                go Back
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
};

export default ErrorPage;
