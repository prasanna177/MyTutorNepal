import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import Map, { Marker, Popup } from "react-map-gl";
import axios from "axios";
import { Box, Text } from "@chakra-ui/react";
import "mapbox-gl/dist/mapbox-gl.css";

const MapPage = () => {
  const [selectedLocation, setSelectedLocaion] = useState(null);
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

  console.log(selectedLocation);
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
              anchor="bottom"
            >
              <Text
                onClick={() => {
                  setSelectedLocaion(result);
                  // setShowPopup(true);
                }}
              >
                📌
              </Text>
            </Marker>
            <Popup
              // onClose={() => setSelectedLocaion({})}
              // closeOnClick={true}
              latitude={result.coordinates.lat}
              longitude={result.coordinates.lng}
              closeButton={true}
              closeOnClick={false}
            >
              {result.fullName}
            </Popup>
          </Box>
        ))}
      </Map>
    </Layout>
  );
};

export default MapPage;
