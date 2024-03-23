import { useNavigate, useParams } from "react-router-dom";
import PanelLayout from "../../components/Layout/PanelLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, HStack, Text, VStack } from "@chakra-ui/react";
import Bundle from "../../components/common/Bundle";
import { getDate, getTime } from "../../components/Utils";
import toast from "react-hot-toast";
import NormalButton from "../../components/common/Button";

const AppointmentInfo = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState([]);

  const handleAccept = async (appointment) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/tutor/acceptAppointment`,
        { appointmentId: appointment._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/tutor/appointments");
        window.location.reload();
      } else {
        toast.error(res.data.message);
        navigate("/tutor/appointments");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_SERVER_PORT
        }/api/appointment/deleteAppointmentById`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/tutor/appointments");
        window.location.reload();
      } else {
        toast.error(res.data.message);
        navigate("/tutor/appointments");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const getAppointmentInfo = async () => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_SERVER_PORT
        }/api/appointment/getAppointmentById`,
        { appointmentId: params.appointmentId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setAppointment(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointmentInfo();
    //eslint-disable-next-line
  }, []);

  console.log(appointment, "appointment");

  return (
    <PanelLayout title={"Appointment Information"}>
      <VStack alignItems={"stretch"} gap={7}>
        <VStack gap={5} alignItems={"stretch"}>
          <Text variant={"heading2"}>Student details</Text>
          <Grid
            p={5}
            borderWidth={1}
            borderRadius={"5px"}
            templateColumns="repeat(3, 1fr)"
            gap={"16px"}
          >
            <Bundle
              title={"Full Name"}
              subtitle={appointment?.userInfo?.fullName}
            />
            <Bundle title={"Email"} subtitle={appointment?.userInfo?.email} />
            <Bundle title={"Phone"} subtitle={appointment?.userInfo?.phone} />
          </Grid>
        </VStack>

        <VStack gap={5} alignItems={"stretch"}>
          <Text variant={"heading2"}>Appointment details</Text>
          <Grid
            p={5}
            borderWidth={1}
            borderRadius={"5px"}
            templateColumns="repeat(3, 1fr)"
            gap={"16px"}
          >
            <Bundle
              title={"From date"}
              subtitle={getDate(appointment?.fromDate)}
            />
            <Bundle title={"To date"} subtitle={getDate(appointment?.toDate)} />
            <Bundle title={"Time"} subtitle={getTime(appointment?.time)} />
            <Bundle title={"Subject"} subtitle={appointment?.subject} />
            <Bundle
              title={"Fee per class"}
              subtitle={appointment?.feePerClass}
            />
            <Bundle title={"Total Price"} subtitle={appointment?.totalPrice} />
            <Bundle title={"Message"} subtitle={appointment?.message} />
          </Grid>
          <HStack justifyContent={"space-between"}>
            <NormalButton
              color={"primary.0"}
              bgColor={"primary.100"}
              text={"Back"}
              onClick={() => {
                navigate("/tutor/appointments");
              }}
            />
            {appointment?.status === "pending" && (
              <>
                <HStack gap={4}>
                  <NormalButton
                    color={"error.100"}
                    bgColor={"error.0"}
                    text={"Reject"}
                    onClick={() => handleReject(appointment._id)}
                  />
                  <NormalButton
                    color={"white"}
                    bgColor={"primary.0"}
                    text={"Accept"}
                    onClick={() => handleAccept(appointment)}
                  />
                </HStack>
              </>
            )}
          </HStack>
        </VStack>
      </VStack>
    </PanelLayout>
  );
};

export default AppointmentInfo;
