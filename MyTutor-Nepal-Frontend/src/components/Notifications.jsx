import { BellIcon } from "@chakra-ui/icons";
import { Box, Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <Menu>
      <MenuButton>
        <Flex pos={"relative"}>
          <BellIcon boxSize={10} color={"black"} />
          <Box
            bgColor={"red"}
            color={"white"}
            pos={"absolute"}
            top={"-2px"}
            right={"-1px"}
            paddingX={"5px"}
            borderRadius={"14px"}
            fontSize={"12px"}
          >
            {user?.notification != 0 && user?.notification?.length}
          </Box>
        </Flex>
      </MenuButton>
      <MenuList>
        {!user?.notification.length && "No new notifications"}
        {user?.notification.map((item, index) => (
          <MenuItem onClick={() => navigate(item.onClickPath)} key={index}>
            {item.message}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default Notifications;
