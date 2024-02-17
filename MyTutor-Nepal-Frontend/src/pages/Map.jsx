import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import Map, { Marker, Popup } from "react-map-gl";
import axios from "axios";
import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Text,
} from "@chakra-ui/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
  const navigate = useNavigate();
  const [selectedLocationId, setSelectedLocaionId] = useState(null);
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

  const [viewPort, setViewPort] = useState({
    width: "100%",
    height: "100%",
    latitude: 27.7291686,
    longitude: 85.3335083,
    zoom: 18,
  });
  const mapBoxKey =
    "pk.eyJ1IjoicHJhc2FubmE3NyIsImEiOiJjbHM3azZsMnAxdGNpMmxxcG40aWZiODZlIn0.iVFFaLMdf8uMXlnsMxjg0A";

  const handleMarkerClick = (id) => {
    setSelectedLocaionId(id);
  };
  return (
    <Layout>
      <Map
        mapStyle="mapbox://styles/prasanna77/clspm19z2005i01pkahql9x7t"
        mapboxAccessToken={mapBoxKey}
        {...viewPort}
        onMove={(nextViewPort) => setViewPort(nextViewPort.viewPort)}
      >
        {tutors?.map((result, index) => (
          <Box key={index}>
            <Marker
              longitude={result.coordinates.lng}
              latitude={result.coordinates.lat}
              anchor="left"
            >
              <Badge
                bgColor={
                  result._id === selectedLocationId ? "black" : "primary.0"
                }
                color={"white"}
                px={3}
                py={2}
                borderRadius={20}
                onClick={() => handleMarkerClick(result._id)}
              >
                <Text fontSize={11}>Rs. {result.feePerClass}</Text>
              </Badge>
            </Marker>
            {result._id === selectedLocationId && (
              <Popup
                latitude={result.coordinates.lat}
                longitude={result.coordinates.lng}
                closeButton={true}
                closeOnClick={false}
                closeOnMove={true}
                onClose={() => setSelectedLocaionId(null)}
              >
                <Card cursor={"pointer"} onClick={() => navigate(`/book-tutor/${result._id}`)}>
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
    </Layout>
  );
};

export default MapPage;
