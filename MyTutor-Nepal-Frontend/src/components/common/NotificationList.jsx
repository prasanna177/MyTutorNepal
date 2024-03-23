import { Box, Divider, HStack, MenuItem, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getDateAndTime } from "../Utils";
import { useDispatch } from "react-redux";
import { showRatingModal } from "../../redux/features/ratingSlice";
import { setTutor } from "../../redux/features/tutorSlice";
import { setNotification } from "../../redux/features/notificationIdSlice";

const NotificationList = ({ notification }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNotificationClick = (item) => {
    if (item.type === "Appointment-completion") {
      console.log("asd");
      dispatch(setTutor(item.tutor));
      dispatch(setNotification(item.id));
      dispatch(showRatingModal());
    } else {
      navigate(item.onClickPath && item.onClickPath);
    }
  };

  return (
    <>
      {!notification?.length && "No new notifications"}
      {notification?.map((item, index) => (
        <Box key={index}>
          <MenuItem
            onClick={() => handleNotificationClick(item)}
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
