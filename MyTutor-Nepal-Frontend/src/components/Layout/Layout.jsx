import {
  Box,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
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
              <HStack flex={"1"} maxW={"500px"}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    // eslint-disable-next-line react/no-children-prop
                    children={<SearchIcon color="black" />}
                  />
                  <Input
                    placeholder="Enter keywords"
                    borderRadius={"20px"}
                    type="text"
                    borderColor={"gray.100"}
                  />
                </InputGroup>
              </HStack>
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
