import { useParams } from "react-router-dom";
import PanelLayout from "../../components/Layout/PanelLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, Text, VStack } from "@chakra-ui/react";
import Bundle from "../../components/common/Bundle";
import { getDate, getTime } from "../../components/Utils";

const AppointmentInfo = () => {
  const params = useParams();
  const [appointment, setAppointment] = useState([]);

  const getAppointmentInfo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/appointment/getAppointmentById",
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
          <Bundle title={"Fee per class"} subtitle={appointment?.feePerClass} />
          <Bundle title={"Total Price"} subtitle={appointment?.totalPrice} />
        </Grid>
      </VStack>
    </PanelLayout>
  );
};

export default AppointmentInfo;
