import {
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { AdminMenu, StudentMenu } from "../../data/sidebarData";
import { useSelector } from "react-redux";
import { SearchIcon } from "@chakra-ui/icons";
import Notifications from "../Notifications";
import ProfilePopup from "../ProfilePopup";

const PanelLayout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const TutorMenu = [
    {
      name: "Home",
      path: "/tutor",
      icon: "fa-solid fa-house",
    },
    {
      name: "Students",
      path: "/tutor/students",
      icon: "fa-solid fa-users",
    },
    {
      name: "Appointments",
      path: "/tutor/appointments",
      icon: "fa-solid fa-calendar-check",
    },
    {
      name: "Profile",
      path: `/tutor/profile/${user?._id}`,
      icon: "fa-regular fa-user",
    },
  ];
  const SideBarMenu =
    user?.role === "admin"
      ? AdminMenu
      : user?.role === "tutor"
      ? TutorMenu
      : StudentMenu;
  return (
    <>
      <Box h={"100vh"} pt={2}>
        <Flex>
          <Box
            p={4}
            pos={"fixed"}
            minH={"100%"}
            w={"250px"}
            mr={"20px"}
            bgColor={"white"}
          >
            <VStack>
              <Box maxW={"200px"}>
                <Link to={"/"}>
                  <Image src={logo} w={"200px"} />
                </Link>
              </Box>
              <Divider />
              <Box w={"100%"} color={"gray.700"} fontSize={"lg"}>
                {SideBarMenu.map((menu, index) => (
                  <Link key={index} to={menu.path}>
                    <HStack
                      p={"10px"}
                      _hover={{ bgColor: "primary.0", color: "white" }}
                      borderRadius={"5px"}
                    >
                      <i className={menu.icon}></i>
                      <Text>{menu.name}</Text>
                    </HStack>
                  </Link>
                ))}
              </Box>
            </VStack>
          </Box>
          <Box pr={"20px"} ml={"255px"} w={"100%"} h={"100%"}>
            <Box borderBottom={"gray.200"} mb={"20px"} bgColor={"white"}>
              <HStack justifyContent={"space-between"} gap={"300px"}>
                <HStack flex={"1"} maxW={"500px"}>
                  {user?.role === "student" && (
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
                  )}
                </HStack>
                <HStack>
                  <Notifications />
                  <ProfilePopup />
                </HStack>
              </HStack>
            </Box>
            <Box minH={"86vh"} bgColor={"white"} mb={"20px"}>
              {children}
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default PanelLayout;
