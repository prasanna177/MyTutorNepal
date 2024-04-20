import { useParams, useNavigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import NormalButton from "../components/common/Button";
import PaymentMessage from "../components/PaymentMessage";
import SpinnerComponenet from "../components/SpinnerComponent";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const urlString = window.location.href;
  const urlParams = new URLSearchParams(urlString);
  const pidx = urlParams.get("pidx");

  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(null);

  const { bookingId } = params;

  useEffect(() => {
    const getPaymentStatus = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_PORT}/api/khalti/khalti-lookup`,
          { pidx },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setLoading(false);
        if (res.data.success) {
          setIsPaymentSuccessful(true);
          const res = await axios.post(
            `${import.meta.env.VITE_SERVER_PORT}/api/user/book-tutor-khalti`,
            { bookingId },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          if (res.data.success) {
            toast.success(res.data.message);
          } else {
            toast.error(res.data.message);
          }
        } else {
          setIsPaymentSuccessful(false);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    getPaymentStatus();
    //eslint-disable-next-line
  }, []);
  return (
    <Flex flexDir={"column"} alignItems={"center"} gap={4}>
      {loading ? (
        <SpinnerComponenet /> // Make sure SpinnerComponenet is imported
      ) : (
        <>
          <PaymentMessage success={isPaymentSuccessful} />
          <NormalButton
            color={"white"}
            bgColor={"primary.0"}
            text={"Take me to home"}
            onClick={() => {
              navigate("/home");
            }}
          />
        </>
      )}
    </Flex>
  );
};

export default PaymentSuccess;
