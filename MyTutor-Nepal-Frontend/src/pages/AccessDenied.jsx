import { Box, Button, Image, Text, VStack } from "@chakra-ui/react";
import NoAccess from "../assets/images/NoAccess.png";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();
  return (
    <Box fontSize={"14px"} fontWeight={500} color={"gray.400"}>
      <VStack justifyContent="center" alignItems="center" height="100%">
        <Image h={"400px"} src={NoAccess} />
        <Text variant={"overline"}>Access denied</Text>
        <Button onClick={() => navigate('/login')}>Go back</Button>
      </VStack>
    </Box>
  );
};

export default AccessDenied;
