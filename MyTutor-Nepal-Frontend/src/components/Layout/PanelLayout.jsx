import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const PanelLayout = ({ children, title }) => {
  return (
    <>
      <Box h={"100vh"} pt={2}>
        <Flex>
          <Sidebar />
          <Box ml={"260px"} w={"100%"} h={"100%"}>
            <Navbar />
            <VStack alignItems={"stretch"} gap={4}>
              <Text variant={"heading1"}>{title}</Text>
              <Box p={5} minH={"86vh"} bgColor={"white"}>
                {children}
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default PanelLayout;
