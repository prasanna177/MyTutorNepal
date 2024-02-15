import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Grid, Heading } from "@chakra-ui/react";
import TutorCard from "../components/TutorCard";

const Home = () => {
  const [tutors, setTutors] = useState([]);

  const getTutorData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/user/getAllTutors",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"), //Authorization must start with capital when posting to backend
          },
        }
      );
      if (res.data.success) {
        setTutors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTutorData();
  }, []);
  console.log(tutors, "sss");

  return (
    <Layout>
      <Heading>Home</Heading>
      <Grid gap={"16px"} templateColumns="repeat(5, 1fr)">
        {tutors?.map((tutor) => (
          <TutorCard key={tutor._id} tutor={tutor} />
        ))}
      </Grid>
    </Layout>
  );
};

export default Home;
