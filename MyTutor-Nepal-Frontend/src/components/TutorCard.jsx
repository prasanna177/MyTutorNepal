import { Card, CardBody, CardHeader, Stack, Text } from "@chakra-ui/react";

const TutorCard = ({ tutor }) => {
  return (
    <>
      <Stack>
        <Card>
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
