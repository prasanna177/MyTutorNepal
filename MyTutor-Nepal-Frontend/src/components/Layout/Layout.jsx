import {
  Box,
  HStack,
  Image,
} from "@chakra-ui/react";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import Notifications from "../Notifications";
import ProfilePopup from "../ProfilePopup";

const Layout = ({ children }) => {
  return (
    <>
      <Box p={"20px"} h={"100vh"}>
        <Box w={"100%"} h={"100%"}>
          <Box borderBottom={"gray.200"} mb={"20px"} bgColor={"white"}>
            <HStack justifyContent={"space-between"} gap={"300px"}>
              <Box maxW={"200px"}>
                <Link to={"/"}>
                  <Image src={logo} w={"200px"} />
                </Link>
              </Box>
              <HStack>
                <Notifications />
                <ProfilePopup />
              </HStack>
            </HStack>
          </Box>
          <Box p={"20px"} mb={"20px"} bgColor={"white"}>
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
