import { Box, Divider, Flex, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { AdminMenu } from "../../data/sidebarData";

const PanelLayout = ({ children }) => {
  return (
    <>
      <Box p={"20px"} h={"100vh"}>
        <Flex>
          <Box
            minH={"100%"}
            w={"300px"}
            borderRadius={"5px"}
            bgColor={"white"}
            mr={"20px"}
          >
            <Box maxW={"200px"}>
              <Link to={"/"}>
                <Image src={logo} w={"200px"} />
              </Link>
            </Box>
            <Divider />
            <Box>
              {AdminMenu.map((menu, index) => (
                <Box key={index}>
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </Box>
              ))}
            </Box>
          </Box>
          <Box w={"100%"} h={"100%"}>
            <Box h={"10vh"} mb={"20px"} bgColor={"white"}>
              Header
            </Box>
            <Box h={"85vh"} mb={"20px"} bgColor={"white"}>
              {children}
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default PanelLayout;
