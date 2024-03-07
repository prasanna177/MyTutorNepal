import { Box, Divider, Flex, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { AdminMenu, StudentMenu } from "../../data/sidebarData";
import { useSelector } from "react-redux";

const PanelLayout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const TutorMenu = [
    {
      name: "Home",
      path: "/tutor",
      icon: "fa-solid fa-users",
    },
    {
      name: "Students",
      path: "/tutor/students",
      icon: "fa-solid fa-users",
    },
    {
      name: "Appointments",
      path: "/tutor/appointments",
      icon: "fa-solid fa-users",
    },
    {
      name: "Profile",
      path: `/tutor/profile/${user?._id}`,
      icon: "fa-solid fa-users",
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
      <Box h={"100vh"}>
        <Flex>
          <Box
            pos={"fixed"}
            minH={"100%"}
            w={"250px"}
            borderRadius={"5px"}
            mr={"20px"}
            bgColor={"white"}
          >
            <Box maxW={"200px"}>
              <Link to={"/"}>
                <Image src={logo} w={"200px"} />
              </Link>
            </Box>
            <Divider />
            <Box>
              {SideBarMenu.map((menu, index) => (
                <Box key={index}>
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </Box>
              ))}
            </Box>
          </Box>
          <Box ml={"270px"} w={"100%"} h={"100%"}>
            <Box h={"10vh"} mb={"20px"} bgColor={"white"}>
              Header
            </Box>
            <Box bgColor={"white"} mb={"20px"}>
              {children}
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default PanelLayout;
