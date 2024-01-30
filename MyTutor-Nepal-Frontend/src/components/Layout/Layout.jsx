import {
  Avatar,
  Box,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import logo from "../../assets/images/logo.png";
import { BellIcon, SearchIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { createImageFromInitials } from "../Utils";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  // const initial = user?.fullName.substring(0, 1);
  return (
    <>
      <Box p={"20px"} h={"100vh"}>
        <Box w={"100%"} h={"100%"}>
          <Box borderBottom={"gray.200"} mb={"20px"} bgColor={"white"}>
            <HStack justifyContent={"space-between"} gap={"300px"}>
              <Box maxW={"200px"}>
                <Image src={logo} w={"200px"} />
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
              <HStack w={"200px"}>
                <BellIcon></BellIcon>
                <Avatar
                  size={'sm'}
                  src={localStorage.getItem('token')? createImageFromInitials(user?.fullName) : logo}
                />
              </HStack>
            </HStack>
          </Box>
          <Box h={"85vh"} mb={"20px"} bgColor={"white"}>
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
