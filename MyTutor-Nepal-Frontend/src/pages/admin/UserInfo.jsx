import axios from "axios";
import PanelLayout from "../../components/Layout/PanelLayout";
import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const UserInfo = () => {
  const [user, setUser] = useState([]);
  const params = useParams();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await axios.post(
          "http://localhost:4000/api/user/getUserById",
          { clientId: params.userId },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();
    //eslint-disable-next-line
  }, []);
  return (
    <PanelLayout>
      <Box>{user?.email}</Box>
    </PanelLayout>
  );
};

export default UserInfo;
