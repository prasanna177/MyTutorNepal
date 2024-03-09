import { useNavigate, useParams } from "react-router-dom";
import PanelLayout from "../../components/Layout/PanelLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, HStack, Text, VStack } from "@chakra-ui/react";
import Bundle from "../../components/common/Bundle";
import ImageComponent from "../../components/common/ImageComponent";
import NormalButton from "../../components/common/Button";
import toast from "react-hot-toast";

const TutorInfo = () => {
  const [tutor, setTutor] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  console.log(tutor, "tutor");

  const getTutorInfo = async () => {
    console.log(params.tutorId);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/tutor/getTutorById",
        { tutorId: params.tutorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setTutor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTutorInfo();
    //eslint-disable-next-line
  }, []);

  const handleAccountStatus = async (tutorObj, status) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/admin/changeAccountStatus",
        { tutorId: tutorObj._id, userId: tutorObj.userId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/tutors");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleAccountRejection = async (tutorId) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/tutor/deleteTutorById",
        { tutorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/tutors");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <PanelLayout title={"Tutor detail"}>
      <VStack alignItems={"stretch"} gap={7}>
        <VStack gap={5} alignItems={"stretch"}>
          <Text variant={"heading2"}>Basic details</Text>
          <ImageComponent
            title={"Tutor's photo"}
            src={`http://localhost:4000/${tutor?.profilePicUrl}`}
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
            <Bundle title={"Full Name"} subtitle={tutor?.fullName} />
            <Bundle title={"Email"} subtitle={tutor?.email} />
            <Bundle title={"Phone"} subtitle={tutor?.phone} />
            <Bundle title={"Address"} subtitle={tutor?.address} />
            <Bundle title={"Bio"} subtitle={tutor?.bio} />
            <Bundle
              title={"Applied at"}
              subtitle={new Date(tutor?.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            />
          </Grid>
        </VStack>

        <VStack gap={5} alignItems={"stretch"}>
          <Text variant={"heading2"}>Professional details</Text>
          <Grid
            p={5}
            borderWidth={1}
            borderRadius={"5px"}
            templateColumns="repeat(3, 1fr)"
            gap={"16px"}
          >
            {tutor?.teachingInfo?.map((item, index) => (
              <HStack gap={6} key={index}>
                <Bundle title={"Subject"} subtitle={item.subject} />
                <Bundle title={"Price"} subtitle={item.price} />
                <Bundle title={"Proficiency"} subtitle={item.proficiency} />
              </HStack>
            ))}
            <Bundle
              title={"Timings"}
              subtitle={`${tutor?.timing?.startTime} - ${tutor?.timing?.endTime}`}
            />
          </Grid>
        </VStack>

        <VStack gap={5} alignItems={"stretch"}>
          <Text variant={"heading2"}>Submitted Documents</Text>
          <Grid
            p={5}
            borderWidth={1}
            borderRadius={"5px"}
            templateColumns="repeat(3, 1fr)"
            gap={"16px"}
          >
            <ImageComponent
              title={"National ID Card (Front)"}
              src={`http://localhost:4000/${tutor?.nIdFrontUrl}`}
              isProfileImg={false}
            />
            <ImageComponent
              title={"National ID Card (Back)"}
              src={`http://localhost:4000/${tutor?.nIdBackUrl}`}
              isProfileImg={false}
            />
            <ImageComponent
              title={"Highest education qualification"}
              src={`http://localhost:4000/${tutor?.teachingCertificateUrl}`}
              isProfileImg={false}
            />
          </Grid>
        </VStack>

        <HStack justifyContent={"space-between"}>
          <NormalButton
            color={"primary.0"}
            bgColor={"primary.100"}
            text={"Back"}
            onClick={() => {
              navigate("/admin/tutors");
            }}
          />
          {tutor?.status === "Pending" && (
            <>
              <HStack gap={4}>
                <NormalButton
                  color={"error.100"}
                  bgColor={"error.0"}
                  text={"Reject"}
                  onClick={() => handleAccountRejection(tutor._id)}
                />
                <NormalButton
                  color={"white"}
                  bgColor={"primary.0"}
                  text={"Accept"}
                  onClick={() => handleAccountStatus(tutor, "Approved")}
                />
              </HStack>
            </>
          )}
        </HStack>
      </VStack>
    </PanelLayout>
  );
};

export default TutorInfo;
