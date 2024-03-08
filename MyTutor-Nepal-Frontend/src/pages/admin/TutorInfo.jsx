import { useParams } from "react-router-dom";
import PanelLayout from "../../components/Layout/PanelLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Heading } from "@chakra-ui/react";

const TutorInfo = () => {
  const [tutor, setTutor] = useState([]);
  const params = useParams();

  const getTutorInfo = async () => {
    console.log(params.tutorId);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/tutor/getTutorById",
        { tutorId: params.tutorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
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
      <Heading>Tutor detail</Heading>
      <Box>{tutor?.fullName}</Box>
    </PanelLayout>
  );
};

export default TutorInfo;
