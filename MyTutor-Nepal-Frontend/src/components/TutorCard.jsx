import { Card, CardBody, CardHeader, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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
            <Text>Fee Per Class: {tutor.feePerClass}</Text>
            <Text>
              Timing: {tutor.timing.startTime + "-" + tutor.timing.endTime}
            </Text>
            <Text>Address: {tutor.address}</Text>
            <Text>Phone: {tutor.phone}</Text>
          </CardBody>
        </Card>
      </Stack>
    </>
  );
};

export default TutorCard;
