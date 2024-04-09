import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Grid,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import TutorCard from "../components/TutorCard";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import PanelLayout from "../components/Layout/PanelLayout";
import { subjectCategories } from "../data/subjectCategories";
import { filterPrices } from "../data/filterPrice";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { sortData } from "../data/sortData";
import NoTutor from "../assets/images/NoTutor.png";

// import SpinnerComponenet from "../components/SpinnerComponent";



const Home = () => {
  const [loading, setLoading] = useState(false);
  console.log(loading);
  const [tutors, setTutors] = useState([]);
  const [category, setCategory] = useState("");
  const [pricePerLessonObj, setPricePerLessonObj] = useState(null);
  const [pricePerLessonVal, setPricePerLessonVal] = useState("");
  const [sortBy, setSortBy] = useState("");
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
    console.log("Search Query:", event.target.value);
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

  const handleSortByChange = (event) => {
    const value = event.target.value;
    setSortBy(value);
  };

  const getTutorData = async () => {
    try {
      // Fetch all tutors from the server
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/getAllTutors`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setLoading(false);
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
              tutor.fullName.toLowerCase().includes(lowerCaseQuery) ||
              tutor.teachingInfo.some((info) =>
                info.subject.toLowerCase().includes(lowerCaseQuery)
              ) ||
              tutor.teachingInfo.some((info) =>
                info.category.toLowerCase().includes(lowerCaseQuery)
              )
            );
          });
        }

        // Apply sorting based on sortBy
        if (sortBy === "Rating") {
          filteredTutors.sort((a, b) => b.averageRating - a.averageRating);
        } else if (sortBy === "Reviews: Good to bad") {
          const sentimentValue = {
            positive: 1,
            neutral: 0,
            negative: -1,
          };

          filteredTutors.sort((a, b) => {
            // Compare tutors based on their sentiment value
            return (
              sentimentValue[b.averageSentiment] -
              sentimentValue[a.averageSentiment]
            );
          });
        }

        setTutors(filteredTutors);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getTutorData();
    //eslint-disable-next-line
  }, [category, pricePerLessonObj, searchQuery, pricePerLessonVal, sortBy]);
  return (
    <PanelLayout>
      {/* {loading ? (
        <SpinnerComponenet />
      ) : ( */}
      <>
        <VStack gap={8} alignItems={"stretch"}>
          <Grid templateColumns="repeat(3, 1fr)" gap={"16px"}>
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
            <FormControl variant={"floating"}>
              <Select onChange={handleSortByChange}>
                <option value="">Any</option>
                {sortData.map((item) => (
                  <option key={item.id} value={item.sortItem}>
                    {item.sortItem}
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
                Sort by
              </FormLabel>
            </FormControl>
            <InputGroup>
              <InputLeftElement>
                <SearchIcon color="black" />
              </InputLeftElement>
              <Input
                placeholder="Search by keywords or name"
                type="text"
                onChange={handleSearchInputChange}
                value={searchQuery}
                borderColor={"gray.100"}
              />
              <InputRightElement
                onClick={() => setSearchQuery("")}
                _hover={{ cursor: "pointer" }}
              >
                <CloseIcon color="black" />
              </InputRightElement>
            </InputGroup>
          </Grid>
          <Box pos={"relative"}>
            {tutors.length > 0 ? (
              <Grid
                gap={"16px"}
                templateColumns={{
                  lg: "repeat(5, 1fr)",
                  md: "repeat(3, 1fr)",
                  sm: "repeat(1, 1fr)",
                }}
              >
                {tutors?.map((tutor) => (
                  <TutorCard key={tutor._id} tutor={tutor} />
                ))}
              </Grid>
            ) : (
              <Center>
                <VStack alignItems={"center"} justifyContent={"center"}>
                  <Image h={"400px"} src={NoTutor} />
                  <Text variant={"heading1"} color={"gray.400"}>
                    Looks like no tutors are available.
                  </Text>
                  <Text variant={"heading2"} color={"gray.100"}>
                    Try removing filters
                  </Text>
                </VStack>
              </Center>
            )}
          </Box>
        </VStack>
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
      </>
      {/* )} */}
    </PanelLayout>
  );
};

export default Home;
