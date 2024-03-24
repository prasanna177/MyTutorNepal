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
          <CardHeader>
            <Text variant={"heading4"}>{tutor.fullName}</Text>
          </CardHeader>
          <CardBody>
            {tutor.profilePicUrl ? (
              <Image
                w={"250px"}
                h={"200px"}
                objectFit={"cover"}
                src={`${import.meta.env.VITE_SERVER_PORT}/${
                  tutor.profilePicUrl
                }`}
              />
            ) : (
              <Image
                objectFit={"cover"}
                w={"250px"}
                h={"200px"}
                src={NoProfilePic}
              />
            )}
            <Text variant={"heading4"}>
              Timing: {tutor.timing.startTime + "-" + tutor.timing.endTime}
            </Text>
            <Text variant={"heading4"}>Phone: {tutor.phone}</Text>
          </CardBody>
        </Card>
      </Stack>
    </>
  );
};

export default TutorCard;
