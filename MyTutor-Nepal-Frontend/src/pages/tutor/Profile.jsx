import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PanelLayout from "../../components/Layout/PanelLayout";
import Bundle from "../../components/common/Bundle";
import { Box, Text } from "@chakra-ui/react";
import ImageComponent from "../../components/common/ImageComponent";

const Profile = () => {
  const [tutor, setTutor] = useState(null);
  const params = useParams();

  const getTutorInfo = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/tutor/getTutorInfo`,
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setTutor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(tutor);

  useEffect(() => {
    getTutorInfo();
    //eslint-disable-next-line
  }, []);
  return (
    <PanelLayout title={"Profile"}>
      <Box w={"300px"} h={"300px"}>
        <ImageComponent src={tutor?.profilePicUrl} />
      </Box>
      <Bundle title={"Full Name"} subtitle={tutor?.fullName} />
    </PanelLayout>
  );
};

export default Profile;
