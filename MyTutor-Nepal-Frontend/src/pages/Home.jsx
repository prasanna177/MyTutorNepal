import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Button, Grid } from "@chakra-ui/react";
import TutorCard from "../components/TutorCard";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import PanelLayout from "../components/Layout/PanelLayout";
import { useSelector } from "react-redux";

const Home = () => {
  const [tutors, setTutors] = useState([]);
  const { tutor } = useSelector((state) => state.tutor);

  const getTutorData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/getAllTutors`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
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
  console.log(tutor, "asd");
  return (
    <PanelLayout>
      <Box pos={"relative"}>
        <Link to="/map">
          <Button
            pos={"fixed"}
            zIndex={12}
            left={"48%"}
            borderRadius={20}
            bottom={5}
            bgColor={"primary.0"}
            _hover={{
              transform: "scale(1.03)",
              transition: "transform 0.3s ease-in-out",
            }}
            _active={{
              transform: "scale(1)",
              transition: "transform 0.3s ease-in-out",
            }}
            color={"white"}
            rightIcon={<FontAwesomeIcon icon={faMap} />}
          >
            Show Map
          </Button>
        </Link>
        <Grid gap={"16px"} templateColumns="repeat(5, 1fr)">
          {tutors?.map((tutor) => (
            <TutorCard key={tutor._id} tutor={tutor} />
          ))}
        </Grid>
      </Box>
    </PanelLayout>
  );
};

export default Home;
