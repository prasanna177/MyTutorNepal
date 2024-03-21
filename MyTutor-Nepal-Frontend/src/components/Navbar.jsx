import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import Notifications from "./Notifications";
import ProfilePopup from "./ProfilePopup";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <Box py={3} pr={3} borderBottom={"gray.200"} mb={"20px"} bgColor={"white"}>
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
  );
};

export default Navbar;
