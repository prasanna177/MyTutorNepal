import { Box, HStack } from "@chakra-ui/react";
import Notifications from "./Notifications";
import ProfilePopup from "./ProfilePopup";

const Navbar = () => {
  return (
    <Box py={3} pr={3} borderBottom={"gray.200"} mb={"20px"} bgColor={"white"}>
      <HStack justifyContent={"flex-end"}>
        <HStack>
          <Notifications />
          <ProfilePopup />
        </HStack>
      </HStack>
    </Box>
  );
};

export default Navbar;
