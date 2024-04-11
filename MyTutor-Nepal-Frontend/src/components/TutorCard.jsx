import { Box, VStack, Text, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import DisplayStars from "./DisplayStars";
import ImageComponent from "./common/ImageComponent";
import SentimentFace from "./SentimentFace";

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        key={tutor._id}
        cursor={"pointer"}
        onClick={() => navigate(`/book-tutor/${tutor._id}`)}
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
      >
        <ImageComponent
          width={"310px"}
          height={"300px"}
          isProfileImg={true}
          src={tutor.profilePicUrl}
        />

        <HStack justify={"space-between"} align={"start"}>
          <VStack alignItems={"start"} p={3}>
            <Box>
              <Text variant={"heading2"}>{tutor.fullName}</Text>
              <Box display="flex" alignItems="center">
                <DisplayStars rating={tutor.averageRating} />
                <Box as="span" ml="2" color="gray.600" fontSize="sm">
                  <Text variant={"overline"}>
                    {tutor.ratings.length} reviews
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box>
              {tutor.teachingInfo.map((info) => (
                <Text variant={"subtitle1"} key={info._id}>
                  {info.subject} - Rs. {info.price} ({info.proficiency})
                </Text>
              ))}
            </Box>
          </VStack>
          <Box mt={3} mr={5}>
            <SentimentFace sentiment={tutor.averageSentiment} />
          </Box>
        </HStack>
      </Box>

      {/* <Stack>
        <Card
          cursor={"pointer"}
          onClick={() => navigate(`/book-tutor/${tutor._id}`)}
        >
          <CardHeader>
            <Text variant={"heading4"}>{tutor.fullName}</Text>
          </CardHeader>
          <CardBody>
            <ImageComponent width={'250px'} height={'250px'} isProfileImg={true} src={tutor.profilePicUrl} />

            <Text variant={"heading4"}>
              Timing: {tutor.timing.startTime + "-" + tutor.timing.endTime}
            </Text>
            <Text variant={"heading4"}>Phone: {tutor.phone}</Text>
            <DisplayStars rating={tutor.averageRating} />
          </CardBody>
        </Card>
      </Stack> */}
    </>
  );
};

export default TutorCard;
