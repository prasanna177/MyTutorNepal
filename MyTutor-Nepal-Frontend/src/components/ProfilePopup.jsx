import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { createImageFromInitials } from "./Utils";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import React from "react";

const ProfilePopup = () => {
  const navigate = useNavigate();
  //logout
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleBecomeTutor = () => {
    navigate("/become-tutor");
  };

  const { user } = useSelector((state) => state.user);
  const popupItems = [
    {
      id: 1,
      name: "Become Tutor",
      function: handleBecomeTutor,
      icon: "fa-solid fa-graduation-cap",
    },
    {
      id: 2,
      name: "Logout",
      function: handleLogout,
      icon: "fa-solid fa-arrow-right-from-bracket",
    },
  ];
  return (
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
              localStorage.getItem("token") &&
              createImageFromInitials(user?.fullName)
            }
          />
        </Flex>
      </MenuButton>
      <MenuList fontSize={"md"}>
        <Flex
          pr={"20px"}
          w={"100%"}
          color={"gray.400"}
          fontSize={"sm"}
          justifyContent={"flex-end"}
        >
          {user?.fullName}
        </Flex>
        {popupItems.map((item) => (
          <React.Fragment key={item.id}>
            <MenuItem _hover={{ bgColor: "gray.0" }} onClick={item.function}>
              <HStack>
                <i className={item.icon} />
                <Text>{item.name}</Text>
              </HStack>
            </MenuItem>
          </React.Fragment>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ProfilePopup;
