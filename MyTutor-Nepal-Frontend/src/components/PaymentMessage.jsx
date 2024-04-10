// Error page

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import PaymentSuccess from "../assets/images/PaymentSuccess.png";
import PaymentFailure from "../assets/images/PaymentFailure.png";

const PaymentMessage = ({ success }) => {
  return (
      <Flex justifyContent={"center"}>
        <Flex
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {success === true ? (
            <Image w={'500px'} src={PaymentSuccess} />
          ) : (
            <Image w={'500px'} src={PaymentFailure} />
          )}
          <Box>
            {success === true ? (
              <Text variant={"subtitle1"}>
                Payment was successful. Appointment request has been sent.
              </Text>
            ) : (
              <Text variant={"subtitle1"}>Payment was not successful because user cancelled or payment link expired. Please try again.</Text>
            )}
          </Box>
        </Flex>
      </Flex>
  );
};

export default PaymentMessage;
