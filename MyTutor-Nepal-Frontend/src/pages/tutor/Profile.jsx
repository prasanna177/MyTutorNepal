import { Heading } from "@chakra-ui/react";
import PanelLayout from "../../components/Layout/PanelLayout";
// import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { axios } from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  // const { user } = useSelector((state) => state.user);
  const [tutor, setTutor] = useState(null);
  const { params } = useParams();

  const getTutorInfo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/tutor/getTutorInfo",
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

  useEffect(() => {
    getTutorInfo();
    //eslint-disable-next-line
  }, []);

  return (
    <PanelLayout>
      <Heading>Manage profile</Heading>
    </PanelLayout>
  );
};

export default Profile;
