import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PanelLayout from "../../components/Layout/PanelLayout";
import Bundle from "../../components/common/Bundle";
import {
  Box,
  Button,
  Divider,
  Grid,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import ImageComponent from "../../components/common/ImageComponent";
import { FaStar } from "react-icons/fa";
import SentimentFace from "../../components/SentimentFace";
import { Tooltip } from "react-tooltip";
import DisplayStars from "../../components/DisplayStars";
import { getDateAndTime } from "../../components/Utils";
import { EditIcon } from "@chakra-ui/icons";

const Profile = () => {
  const [tutor, setTutor] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  const getTutorInfo = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/tutor/getTutorInfo`,
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

  console.log(tutor);

  useEffect(() => {
    getTutorInfo();
    //eslint-disable-next-line
  }, []);
  return (
    <PanelLayout title={"Profile"}>
      <VStack gap={5} alignItems={"stretch"}>
        <Box borderRadius={10} p={5} borderWidth={1}>
          <VStack alignItems={"stretch"}>
            <HStack>
              <ImageComponent
                isProfileImg={true}
                borderRadius={"50%"}
                width={"100px"}
                height={"100px"}
                src={tutor?.profilePicUrl}
              />
              <VStack alignItems={"flex-start"}>
                <Text variant={"heading2"}>{tutor?.fullName}</Text>
                <Text variant={"subtitle2"}>{tutor?.phone}</Text>
                <HStack w={"100%"}>
                  <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Average rating"
                  >
                    <HStack>
                      <FaStar color="#5B3B8C" />
                      <Text variant={"subtitle1"}>{tutor?.averageRating}</Text>
                    </HStack>
                  </div>
                  <Tooltip
                    id="my-tooltip"
                    place="bottom"
                    style={{
                      zIndex: 9999,
                      padding: "7px",
                      backgroundColor: "#AEAEAE",
                      color: "white",
                      fontSize: "11px",
                    }}
                  />
                  <Box>
                    <div
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Overall sentiment from all your reviews generated by AI"
                    >
                      <SentimentFace sentiment={tutor?.averageSentiment} />
                    </div>
                    <Tooltip
                      id="my-tooltip"
                      place="bottom"
                      style={{
                        zIndex: 9999,
                        padding: "7px",
                        backgroundColor: "#AEAEAE",
                        color: "white",
                        fontSize: "11px",
                      }}
                    />
                  </Box>
                </HStack>
              </VStack>
            </HStack>
            <Button
              onClick={() => {
                navigate(`/tutor/edit-profile/${params.id}`);
              }}
              rightIcon={<EditIcon />}
              _hover={{ opacity: 0.8 }}
              _active={{}}
              w={"120px"}
              color={"primary.0"}
              bg={"primary.100"}
            >
              Edit profile
            </Button>
          </VStack>
        </Box>

        <Box borderRadius={10} p={5} borderWidth={1}>
          <VStack gap={4} alignItems={"stretch"}>
            <Box>
              <Text variant={"heading2"}>Personal Information</Text>
            </Box>
            <Grid templateColumns="repeat(3, 1fr)" gap={"16px"}>
              <Bundle title={"Full Name"} subtitle={tutor?.fullName} />
              <Bundle title={"Phone"} subtitle={tutor?.phone} />
              <Bundle title={"Email"} subtitle={tutor?.email} />
              <Bundle title={"Address"} subtitle={tutor?.address} />
              <Bundle title={"Bio"} subtitle={tutor?.bio} />
            </Grid>
          </VStack>
        </Box>

        <div style={{ width: "100%" }}>
          <iframe
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={`https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=${tutor?.coordinates?.lat},%20${tutor?.coordinates?.lng}+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed`}
          ></iframe>
        </div>

        {/* <div style={{ width: "100%" }}>
          <iframe
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCSpdfk2kgBCDaZQHdqxuGNmPIiisl-v6o
            &q=${tutor?.coordinates?.lat},${tutor?.coordinates?.lng}`}
          ></iframe>
        </div> */}

        <Box borderRadius={10} p={5} borderWidth={1}>
          <VStack gap={4} alignItems={"stretch"}>
            <Box>
              <Text variant={"heading2"}>Professional Information</Text>
            </Box>
            <Grid templateColumns="repeat(3, 1fr)" gap={"16px"}>
              {tutor?.teachingInfo?.map((item, index) => (
                <HStack gap={6} key={index}>
                  <Bundle title={"Subject"} subtitle={item.subject} />
                  <Bundle title={"Price"} subtitle={item.price} />
                  <Bundle title={"Proficiency"} subtitle={item.proficiency} />
                </HStack>
              ))}
              <Bundle
                title={"Timings"}
                subtitle={`${tutor?.timing?.startTime} - ${tutor?.timing?.endTime}`}
              />
            </Grid>
          </VStack>
        </Box>

        <Box borderRadius={10} p={5} borderWidth={1}>
          <VStack gap={4} alignItems={"stretch"}>
            <Box>
              <Text variant={"heading2"}>Reviews</Text>
            </Box>

            {tutor?.ratings?.length > 0 ? (
              tutor.ratings.map((rating) => (
                <Box key={rating._id}>
                  <VStack mb={2} alignItems={"stretch"}>
                    <HStack>
                      <Text variant={"heading3"}>{rating.userName}</Text>
                      <Text variant={"subtitle2"}>
                        {getDateAndTime(rating.createdAt)}
                      </Text>
                    </HStack>
                    <HStack>
                      <SentimentFace sentiment={rating.sentiment} />
                      <DisplayStars rating={rating.rating} />
                    </HStack>
                    <Text variant={"subtitle2"}>{rating.review}</Text>
                  </VStack>

                  <Divider />
                </Box>
              ))
            ) : (
              <Text textAlign={"center"} variant={"overline"}>
                No reviews
              </Text>
            )}
          </VStack>
        </Box>
      </VStack>
    </PanelLayout>
  );
};

export default Profile;
