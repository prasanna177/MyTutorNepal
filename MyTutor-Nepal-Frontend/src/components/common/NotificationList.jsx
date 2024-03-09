import { Box, Divider, HStack, MenuItem, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getDateAndTime } from "../Utils";

const NotificationList = ({ notification }) => {
  const navigate = useNavigate();
  return (
    <>
      {!notification?.length && "No new notifications"}
      {notification?.map((item, index) => (
        <Box key={index}>
          <MenuItem
            onClick={() => navigate(item.onClickPath && item.onClickPath)}
            _hover={{ bgColor: "gray.0" }}
          >
            <VStack alignItems={"start"}>
              <Box fontSize={"md"} fontWeight={"bold"}>
                {item.message}
              </Box>
              <HStack fontSize={"sm"} color={"gray.100"}>
                <i className="fa-regular fa-clock"></i>
                <Text>{item.date && getDateAndTime(item.date)}</Text>
              </HStack>
            </VStack>
          </MenuItem>
          <Divider borderWidth={"1px"} />
        </Box>
      ))}
    </>
  );
};

export default NotificationList;
