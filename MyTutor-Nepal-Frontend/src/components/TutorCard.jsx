import {
  Card,
  CardBody,
  CardHeader,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NoProfilePic from "../assets/images/NoProfilePic.png";

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();
  return (
    <>
      <Stack>
        <Card
          cursor={"pointer"}
          onClick={() => navigate(`/book-tutor/${tutor._id}`)}
        >
          <CardHeader>{tutor.fullName}</CardHeader>
          <CardBody>
            {tutor.profilePicUrl ? (
              <Image
                w={"250px"}
                h={"200px"}
                objectFit={"cover"}
                src={`http://localhost:4000/${tutor.profilePicUrl}`}
              />
            ) : (
              <Image objectFit={"cover"} w={"250px"} h={"200px"} src={NoProfilePic} />
            )}
            <Text>
              Timing: {tutor.timing.startTime + "-" + tutor.timing.endTime}
            </Text>
            <Text>Phone: {tutor.phone}</Text>
          </CardBody>
        </Card>
      </Stack>
    </>
  );
};

export default TutorCard;
