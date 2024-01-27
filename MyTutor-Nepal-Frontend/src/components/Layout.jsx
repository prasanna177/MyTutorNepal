import { Box, Flex } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <>
      <Box p={"20px"} h={"100vh"}>
        {" "}
        {/*main */}
        <Flex>
          {" "}
          {/*layout */}
          <Box
            minH={"100%"}
            w={"300px"}
            borderRadius={"5px"}
            bgColor={"brown"}
            mr={"20px"}
          >
            {" "}
            {/*sidebar */}
            <Box>Logo</Box>
            <Box>Menu</Box>
          </Box>
          <Box w={"100%"} h={"100%"}>
            {" "}
            {/*content */}
            <Box h={"10vh"} mb={"20px"} bgColor={"white"}>
              Header
            </Box>
            <Box h={"85vh"} mb={"20px"} bgColor={"white"}>
              {children}
            </Box>{" "}
            {/*body */}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Layout;
