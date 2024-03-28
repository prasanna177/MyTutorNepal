import { Box, Divider, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { AdminMenu, StudentMenu } from "../data/sidebarData";

const Sidebar = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
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
    {
      name: "Edit Profile",
      path: `/tutor/edit-profile/${user?._id}`,
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
          {SideBarMenu.map((menu, index) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link key={index} to={menu.path}>
                <HStack
                  bg={isActive ? "primary.0" : "white"}
                  color={isActive ? "white" : "gray.700"}
                  p={"10px"}
                  _hover={{ bgColor: "primary.100", color: "primary.0" }}
                  borderRadius={"5px"}
                >
                  <i className={menu.icon}></i>
                  <Text>{menu.name}</Text>
                </HStack>
              </Link>
            );
          })}
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
