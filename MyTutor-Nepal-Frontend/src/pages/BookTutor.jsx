import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Heading, Text } from "@chakra-ui/react";

const BookTutor = () => {
  const params = useParams();
  const [tutor, setTutor] = useState([]);
  console.log(tutor);

  const getTutorData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/tutor/getTutorById",
        { tutorId: params.tutorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"), //Authorization must start with capital when posting to backend
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
    getTutorData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <Heading>Booking Page</Heading>
      <Text>Name: {tutor?.fullName}</Text>
      <Text>Fee: {tutor?.feePerClass}</Text>
      <Text>
        Timing{tutor?.timing?.startTime + "-" + tutor?.timing?.endTime}
      </Text>
    </Layout>
  );
};

export default BookTutor;
