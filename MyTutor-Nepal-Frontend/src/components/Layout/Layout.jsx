import {
  Avatar,
  Box,
  Flex,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import logo from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { createImageFromInitials } from "../Utils";
import toast from "react-hot-toast";
import Notifications from "../Notifications";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  //logout
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const { user } = useSelector((state) => state.user);
  // const initial = user?.fullName.substring(0, 1);
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
                <Menu>
                  <MenuButton>
                    <Flex
                      alignItems={"center"}
                      p={2}
                      justifyContent={"space-between"}
                      border={"1px"}
                      borderRadius={20}
                      w={"80px"}
                      borderColor={"gray.400"}
                    >
                      <HamburgerIcon />
                      <Avatar
                        size={"sm"}
                        src={
                          localStorage.getItem("token")
                            ? createImageFromInitials(user?.fullName)
                            : logo
                        }
                      />
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    <Link to={"/become-tutor"}>
                      <MenuItem>Become a Tutor</MenuItem>
                    </Link>
                  </MenuList>
                </Menu>
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
