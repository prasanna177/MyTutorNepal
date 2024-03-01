import { Box, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(false);
  const params = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        console.log(params);
        const res = await axios.get(
          `http://localhost:4000/api/user/${params.id}/verify/${params.token}`
        );
        console.log(res, "asd");
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [params]);
  return (
    <Box>
      {validUrl ? (
        <>
          <Heading>Email Verified successfully</Heading>
          <Link to={"/login"}>
            <Text textDecoration={"underline"} color={"primary.0"}>
              Take me to login
            </Text>
          </Link>
        </>
      ) : (
        <Heading>404! Page not found</Heading>
      )}
    </Box>
  );
};

export default EmailVerify;
