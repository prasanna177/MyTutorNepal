import { BellIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationList from "./common/NotificationList";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser } from "../redux/features/userSlice";
// import { hideLoading, showLoading } from "../redux/features/alertSlice";

const Notifications = () => {
  const dispatch = useDispatch();
  const [isUnseen, setIsUnseen] = useState(true);
  const { user } = useSelector((state) => state.user);

  const markAllAsSeen = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/mark-notification-as-seen`,
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const deleteAll = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/delete-all-notifications`,
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
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
            {user?.unseenNotification != 0 &&
              (user?.unseenNotification?.length <= 9
                ? user.unseenNotification.length
                : "9+")}
          </Box>
        </Flex>
      </MenuButton>
      <MenuList zIndex={100}
        h={"500px"}
        w={"400px"}
        overflowY={"auto"}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "gray.200 white",
        }}
      >
        <HStack p={"20px"} justifyContent={"space-between"}>
          <Text fontSize={"3xl"}>Notifications</Text>
          {isUnseen ? (
            <Text
              cursor={"pointer"}
              _hover={{ textDecoration: "underline" }}
              fontSize={"md"}
              color={"primary.0"}
              onClick={() => markAllAsSeen()}
            >
              Mark as read
            </Text>
          ) : (
            <Text
              cursor={"pointer"}
              _hover={{ textDecoration: "underline" }}
              fontSize={"md"}
              color={"primary.0"}
              onClick={() => deleteAll()}
            >
              Delete seen notifications
            </Text>
          )}
        </HStack>
        <Tabs colorScheme={"purple"}>
          <TabList>
            <Tab onClick={() => setIsUnseen(true)}>
              Unseen ({user?.unseenNotification?.length || 0})
            </Tab>
            <Tab onClick={() => setIsUnseen(false)}>
              Seen ({user?.seenNotification?.length || 0})
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <NotificationList notification={user?.unseenNotification} />
            </TabPanel>
            <TabPanel>
              <NotificationList notification={user?.seenNotification} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </MenuList>
    </Menu>
  );
};

export default Notifications;
