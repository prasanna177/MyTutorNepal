import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import Map, { Marker, Popup } from "react-map-gl";
import axios from "axios";
import { FaGraduationCap } from "react-icons/fa";
import { FaMapPin } from "react-icons/fa";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";

import {
  Box,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import "../../index.scss";
// import "mapbox-gl/dist/mapbox-gl.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import TutorCard from "../components/TutorCard";
import { filterPrices } from "../data/filterPrice";
import { subjectCategories } from "../data/subjectCategories";

const MapPage = () => {
  const { user } = useSelector((state) => state.user);
  const [selectedLocationId, setSelectedLocaionId] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [category, setCategory] = useState("");
  const [pricePerLessonObj, setPricePerLessonObj] = useState(null);
  const [pricePerLessonVal, setPricePerLessonVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setCategory("");
      setPricePerLessonVal("");
      setPricePerLessonObj(null);
    } else {
      setCategory(value);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePricePerLessonChange = (e) => {
    if (e.target.value === "") {
      setPricePerLessonObj("");
      setPricePerLessonVal("");
    }
    const selectedPriceInfo = filterPrices.find(
      (item) => item.price === e.target.value
    );
    setPricePerLessonObj(selectedPriceInfo);
    setPricePerLessonVal(selectedPriceInfo.price);
  };

  const getTutorData = async () => {
    try {
      // Fetch all tutors from the server
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/getAllTutors`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        let filteredTutors = res.data.data;

        // Apply filtering based on category and pricePerLesson
        if (category !== "" || pricePerLessonObj !== null) {
          filteredTutors = filteredTutors?.filter((tutor) => {
            // Check if category matches
            if (
              category &&
              tutor.teachingInfo.some((info) => info.category === category)
            ) {
              // If pricePerLesson is selected, check if tutor's price matches
              if (pricePerLessonObj) {
                if (pricePerLessonObj.type === "lessThan") {
                  return tutor.teachingInfo.some(
                    (info) =>
                      info.price <
                      pricePerLessonObj.price.split(" ")[
                        pricePerLessonObj.price.split(" ").length - 1
                      ]
                  );
                } else if (pricePerLessonObj.type === "greaterThan") {
                  return tutor.teachingInfo.some(
                    (info) =>
                      info.price >
                      pricePerLessonObj.price.split(" ")[
                        pricePerLessonObj.price.split(" ").length - 1
                      ]
                  );
                }
              }
              return true; // If no pricePerLesson is selected, return true
            }
            return false; // If category doesn't match, filter out the tutor
          });
        }

        if (searchQuery) {
          const lowerCaseQuery = searchQuery.toLowerCase();
          filteredTutors = filteredTutors.filter((tutor) => {
            return (
              tutor?.fullName?.toLowerCase().includes(lowerCaseQuery) ||
              tutor?.address?.toLowerCase().includes(lowerCaseQuery) ||
              tutor?.teachingInfo?.some((info) =>
                info?.subject?.toLowerCase().includes(lowerCaseQuery)
              ) ||
              tutor.teachingInfo.some((info) =>
                info?.category?.toLowerCase().includes(lowerCaseQuery)
              )
            );
          });
        }

        setTutors(filteredTutors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      getTutorData();
    }
  };

  useEffect(() => {
    getTutorData();
    //eslint-disable-next-line
  }, [category, pricePerLessonObj, searchQuery, pricePerLessonVal]);

  const [viewPort, setViewPort] = useState({
    width: "100%",
    height: "100%",
    latitude: user?.coordinates?.lat || 28.3974,
    longitude: user?.coordinates?.lng || 84.1258,
    zoom: 10,
  });
  const mapBoxKey = `${import.meta.env.VITE_MAPBOX_KEY}`;
  const handleMarkerClick = (id) => {
    setSelectedLocaionId(id);
  };
  return (
    <Layout>
      <VStack alignItems={"stretch"}>
        <Grid
          p={5}
          templateColumns="repeat(3, 1fr)"
          style={{ boxShadow: "0px 0px 5px rgba(0,0,0,0.15)" }}
          gap={"16px"}
        >
          <InputGroup>
            <InputLeftElement>
              <SearchIcon color="black" />
            </InputLeftElement>
            <FormControl variant={"floating"}>
              <Input
                pl={9}
                type="text"
                onKeyDown={handleSearch}
                onChange={handleSearchInputChange}
                value={searchQuery}
                borderColor={"gray.100"}
              />
              <FormLabel
                fontWeight={"normal"}
                fontSize={{
                  base: "16px",
                  "2xl": "18px",
                }}
              >
                Search by keywords or name
              </FormLabel>
            </FormControl>
            <InputRightElement
              onClick={() => setSearchQuery("")}
              _hover={{ cursor: "pointer" }}
            >
              <CloseIcon color="black" />
            </InputRightElement>
          </InputGroup>
          <FormControl variant={"floating"}>
            <Select value={category} onChange={handleCategoryChange}>
              <option value="">Any</option>
              {subjectCategories.map((item) => (
                <option key={item.id} value={item.category}>
                  {item.category}
                </option>
              ))}
            </Select>
            <FormLabel
              fontWeight={"normal"}
              fontSize={{
                base: "16px",
                "2xl": "18px",
              }}
            >
              I want to learn
            </FormLabel>
          </FormControl>

          <FormControl variant={"floating"}>
            <Select
              value={pricePerLessonVal}
              onChange={handlePricePerLessonChange}
              disabled={!category}
            >
              <option value="">Any</option>
              {filterPrices.map((item) => (
                <option key={item.id} value={item.price}>
                  {item.price}
                </option>
              ))}
            </Select>
            <FormLabel
              fontWeight={"normal"}
              fontSize={{
                base: "16px",
                "2xl": "18px",
              }}
            >
              Price per lesson
            </FormLabel>
          </FormControl>
        </Grid>
      </VStack>
      <Box height={"76vh"} w={"96vw"} pos={"relative"}>
        <Link to="/home">
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
        <div
          id="map"
          className="mapboxgl-map"
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          <Map
            mapStyle="mapbox://styles/prasanna77/clspm19z2005i01pkahql9x7t"
            mapboxAccessToken={mapBoxKey}
            {...viewPort}
            onMove={(nextViewPort) => setViewPort(nextViewPort.viewPort)}
          >
            {user?.coordinates && (
              <Marker
                longitude={user?.coordinates?.lng}
                latitude={user?.coordinates?.lat}
                anchor="left"
              >
                <FaMapPin color="red" size={40} />
              </Marker>
            )}

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
                    closeButton={false}
                    closeOnClick={false}
                    closeOnMove={true}
                    onClose={() => setSelectedLocaionId(null)}
                  >
                    <TutorCard key={result._id} tutor={result} />
                  </Popup>
                )}
              </Box>
            ))}
          </Map>
        </div>
      </Box>
    </Layout>
  );
};

export default MapPage;
