import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, HStack, Text, VStack } from "@chakra-ui/react";
import PanelLayout from "../components/Layout/PanelLayout";
import Bundle from "../components/common/Bundle";
import { getDate, getTime } from "../components/Utils";
import NormalButton from "../components/common/Button";
import ImageComponent from "../components/common/ImageComponent";

const UserAppointmentInfo = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState([]);

  const getAppointmentInfo = async () => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_SERVER_PORT
        }/api/appointment/getAppointmentById`,
        { appointmentId: params.id },
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

  return (
    <PanelLayout title={"Appointment Information"}>
      <VStack gap={5} alignItems={"stretch"}>
        <Text variant={"heading2"}>Tutor details</Text>
        <ImageComponent
          src={appointment?.tutorInfo?.profilePicUrl}
          isProfileImg={true}
          width={"300px"}
          height={"300px"}
        />
        <Grid
          p={5}
          borderWidth={1}
          borderRadius={"5px"}
          templateColumns="repeat(3, 1fr)"
          gap={"16px"}
        >
          <Bundle
            title={"Full Name"}
            subtitle={appointment?.tutorInfo?.fullName}
          />
          <Bundle title={"Email"} subtitle={appointment?.tutorInfo?.email} />
          <Bundle title={"Phone"} subtitle={appointment?.tutorInfo?.phone} />
          <Bundle
            title={"Address"}
            subtitle={appointment?.tutorInfo?.address}
          />
          <Bundle title={"Bio"} subtitle={appointment?.tutorInfo?.bio} />
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
          <Bundle title={"Message"} subtitle={appointment?.message} />
        </Grid>
        <VStack alignItems={"stretch"}>
          <Text variant={"heading2"}>Tutor Location</Text>
          <iframe
            width="400"
            height="400"
            src={`https://www.google.com/maps/embed/v1/place?key=${
              import.meta.env.VITE_GOOGLE_API_KEY
            }
            &q=${appointment?.tutorInfo?.coordinates?.lat},${
              appointment?.tutorInfo?.coordinates?.lng
            }`}
          ></iframe>
        </VStack>
        <HStack justifyContent={"space-between"}>
          <NormalButton
            color={"primary.0"}
            bgColor={"primary.100"}
            text={"Back"}
            onClick={() => {
              navigate("/student/appointments");
            }}
          />
        </HStack>
      </VStack>
    </PanelLayout>
  );
};

export default UserAppointmentInfo;
