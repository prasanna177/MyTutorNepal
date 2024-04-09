import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import Map, { Marker, Popup } from "react-map-gl";
import axios from "axios";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Text,
  VStack,
} from "@chakra-ui/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const MapPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  console.log(user);
  const [selectedLocationId, setSelectedLocaionId] = useState(null);
  const [tutors, setTutors] = useState([]);

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

  const [viewPort, setViewPort] = useState({
    width: "100%",
    height: "100%",
    latitude: user?.coordinates?.lat,
    longitude: user?.coordinates?.lng,
    zoom: 18,
  });
  const mapBoxKey =
    "pk.eyJ1IjoicHJhc2FubmE3NyIsImEiOiJjbHM3azZsMnAxdGNpMmxxcG40aWZiODZlIn0.iVFFaLMdf8uMXlnsMxjg0A";

  const handleMarkerClick = (id) => {
    setSelectedLocaionId(id);
  };
  return (
    <Layout>
      <Box height={"80vh"} w={"96vw"} pos={"relative"}>
        <Link to="/">
          <Button
            pos={"fixed"}
            zIndex={12}
            left={"48%"}
            bottom={5}
            bgColor={"primary.0"}
            color={"white"}
            borderRadius={20}
            _hover={{
              transform: "scale(1.03)",
              transition: "transform 0.3s ease-in-out",
            }}
            _active={{}}
            rightIcon={<FontAwesomeIcon icon={faList} />}
          >
            Show List
          </Button>
        </Link>
        <Map
          mapStyle="mapbox://styles/prasanna77/clspm19z2005i01pkahql9x7t"
          mapboxAccessToken={mapBoxKey}
          {...viewPort}
          onMove={(nextViewPort) => setViewPort(nextViewPort.viewPort)}
        >
          <Marker
            longitude={user?.coordinates?.lng}
            latitude={user?.coordinates?.lat}
            anchor="left"
          >
            <VStack>
              <Text color="red">You are here</Text>
              <FiMapPin color="red" size={40} />
            </VStack>
          </Marker>
          {tutors?.map((result, index) => (
            <Box key={index}>
              <Marker
                longitude={result?.coordinates?.lng}
                latitude={result?.coordinates?.lat}
                anchor="left"
              >
                <Box onClick={() => handleMarkerClick(result._id)}>
                  <FaGraduationCap color="#5B3B8C" size={40} />
                </Box>
              </Marker>
              {result._id === selectedLocationId && (
                <Popup
                  latitude={result?.coordinates?.lat}
                  longitude={result?.coordinates?.lng}
                  closeButton={true}
                  closeOnClick={false}
                  closeOnMove={true}
                  onClose={() => setSelectedLocaionId(null)}
                >
                  <Card
                    cursor={"pointer"}
                    onClick={() => navigate(`/book-tutor/${result._id}`)}
                  >
                    <CardHeader>{result.fullName}</CardHeader>
                    <CardBody>
                      <Text>Fee Per Class: {result.feePerClass}</Text>
                      <Text>
                        Timing:{" "}
                        {result.timing.startTime + "-" + result.timing.endTime}
                      </Text>
                      <Text>Address: {result.address}</Text>
                      <Text>Phone: {result.phone}</Text>
                    </CardBody>
                  </Card>
                </Popup>
              )}
            </Box>
          ))}
        </Map>
      </Box>
    </Layout>
  );
};

export default MapPage;
