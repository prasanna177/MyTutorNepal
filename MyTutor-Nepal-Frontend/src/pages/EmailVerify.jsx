import { Flex } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SpinnerComponenet from "../components/SpinnerComponent";
import VerifyMessage from "../components/VerifyMessage";

const EmailVerify = () => {
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        setLoading(true);
        await axios.get(
          `${import.meta.env.VITE_SERVER_PORT}/api/user/${params.id}/verify/${
            params.token
          }`
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    verifyEmailUrl();
  }, [params]);
  return (
    <Flex flexDir={"column"} alignItems={"center"} gap={4}>
      {loading ? (
        <SpinnerComponenet />
      ) : (
        <>
          <VerifyMessage />
        </>
      )}
    </Flex>
  );
};

export default EmailVerify;
