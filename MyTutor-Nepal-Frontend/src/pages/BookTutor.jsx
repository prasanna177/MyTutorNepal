import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import * as yup from "yup";
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import toast from "react-hot-toast";
import moment from "moment";
import PanelLayout from "../components/Layout/PanelLayout";
import BookingBox from "../components/BookingBox";
import ImageComponent from "../components/common/ImageComponent";
import { FaStar } from "react-icons/fa";
import SentimentFace from "../components/SentimentFace";
import Bundle from "../components/common/Bundle";
import DisplayStars from "../components/DisplayStars";
import { getDateAndTime } from "../components/Utils";
import SpinnerComponenet from "../components/SpinnerComponent";

const BookTutor = () => {
  const [paymentType, setPaymentType] = useState("Cash on delivery");
  const [loading, setLoading] = useState(false);
  const [tutor, setTutor] = useState([]);
  const [price, setPrice] = useState(0);
  const [subject, setSubject] = useState("");

  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getTutorData = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/tutor/getTutorById`,
        { tutorId: params.tutorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setLoading(false);
      if (res.data.success) {
        setTutor(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const schema = yup.object({
    fromDate: yup.string().required("Please enter the starting date"),
    toDate: yup.string().required("Please enter the ending date"),
    time: yup.string().required("Time is required"),
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Please write a message"),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleBooking = async (data, paymentType) => {
    try {
      //to send total price to backend
      const fromDate = moment(data.fromDate, "YYYY-MM-DD");
      const toDate = moment(data.toDate, "YYYY-MM-DD");
      const numberOfDays = toDate.diff(fromDate, "days") + 1;
      const submissionData = {
        tutorId: params.tutorId,
        userId: user._id,
        tutorInfo: tutor,
        userInfo: user,
        feePerClass: price,
        totalPrice: numberOfDays * price,
        subject,
        paymentType,
        ...data,
      };
      if (paymentType === "Cash on delivery") {
        dispatch(showLoading());
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_PORT}/api/user/book-tutor`,
          submissionData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.message);
        } else {
          if (res.data.type && res.data.type === "no-phone-or-address") {
            navigate(`/student/profile/${user._id}`);
          }
          toast.error(res.data.message);
        }
      }

      if (paymentType === "Khalti") {
        dispatch(showLoading());
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_PORT}/api/khalti/khalti-api`,
          submissionData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(hideLoading());
        if (res.data.success) {
          window.location.href = `${res.data.data.payment_url}`;
        } else {
          if (res.data.type && res.data.type === "no-phone-or-address") {
            navigate(`/student/profile/${user._id}`);
          }
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getTutorData();
    //eslint-disable-next-line
  }, []);

  return (
    <PanelLayout title={"Booking Page"}>
      {loading ? (
        <SpinnerComponenet />
      ) : (
        <Grid templateColumns="repeat(7, 1fr)" gap={4}>
          <GridItem colSpan={{ lg: 5, sm: 7, md: 6 }}>
            <VStack gap={5} alignItems={"stretch"}>
              <Box borderRadius={10} p={5} borderWidth={1}>
                <VStack alignItems={"stretch"}>
                  <Text variant={"heading2"}>About tutor</Text>
                  <HStack alignItems={"start"}>
                    <ImageComponent
                      isProfileImg={true}
                      width={"300px"}
                      height={"300px"}
                      src={tutor?.profilePicUrl}
                    />
                    <VStack alignItems={"start"}>
                      <Text variant={"heading2"}>{tutor?.fullName}</Text>
                      <HStack w={"100%"}>
                        <div
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Average rating"
                        >
                          <HStack gap={0}>
                            <FaStar color="#5B3B8C" />
                            <Text variant={"subtitle1"}>
                              {tutor?.averageRating}
                            </Text>
                          </HStack>
                        </div>
                        <Tooltip
                          id="my-tooltip"
                          place="bottom"
                          style={{
                            zIndex: 9999,
                            padding: "7px",
                            backgroundColor: "#AEAEAE",
                            color: "white",
                            fontSize: "11px",
                          }}
                        />
                        <Box>
                          <div
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Overall sentiment from all your reviews generated by AI"
                          >
                            <SentimentFace
                              sentiment={tutor?.averageSentiment}
                            />
                          </div>
                          <Tooltip
                            id="my-tooltip"
                            place="bottom"
                            style={{
                              zIndex: 9999,
                              padding: "7px",
                              backgroundColor: "#AEAEAE",
                              color: "white",
                              fontSize: "11px",
                            }}
                          />
                        </Box>
                      </HStack>

                      <Text variant={"subtitle2"}>{tutor?.phone}</Text>
                      <Text variant={"subtitle2"}>{tutor?.email}</Text>
                      <Text variant={"subtitle2"}>{tutor?.address}</Text>
                      <Text variant={"heading3"} color={"gray.500"}>
                        {tutor?.bio}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </Box>

              <Box borderRadius={10} p={5} borderWidth={1}>
                <VStack gap={4} alignItems={"stretch"}>
                  <Box>
                    <Text variant={"heading2"}>Professional Information</Text>
                  </Box>
                  <Grid
                    templateColumns={{
                      lg: "repeat(2, 1fr)",
                      md: "repeat(2, 1fr)",
                      sm: "repeat(1, 1fr)",
                    }}
                    gap={"16px"}
                  >
                    {tutor?.teachingInfo?.map((item, index) => (
                      <HStack gap={6} key={index}>
                        <Bundle title={"Subject"} subtitle={item.subject} />
                        <Bundle title={"Fee per class"} subtitle={item.price} />
                        <Bundle
                          title={"Proficiency"}
                          subtitle={item.proficiency}
                        />
                      </HStack>
                    ))}
                    <Bundle
                      title={"Timings"}
                      subtitle={`${tutor?.timing?.startTime} - ${tutor?.timing?.endTime}`}
                    />
                  </Grid>
                </VStack>
              </Box>

              <Box borderRadius={10} p={5} borderWidth={1}>
                <VStack gap={4} alignItems={"stretch"}>
                  <Box>
                    <Text variant={"heading2"}>
                      Reviews ({tutor?.ratings?.length})
                    </Text>
                  </Box>

                  {tutor?.ratings?.length > 0 ? (
                    tutor.ratings.map((rating) => (
                      <Box key={rating._id}>
                        <VStack mb={2} alignItems={"stretch"}>
                          <HStack>
                            <Text variant={"heading3"}>{rating.userName}</Text>
                            <Text variant={"subtitle2"}>
                              {getDateAndTime(rating.createdAt)}
                            </Text>
                          </HStack>
                          <HStack>
                            <SentimentFace sentiment={rating.sentiment} />
                            <DisplayStars rating={rating.rating} />
                          </HStack>
                          <Text variant={"subtitle2"}>{rating.review}</Text>
                        </VStack>

                        <Divider />
                      </Box>
                    ))
                  ) : (
                    <Text textAlign={"center"} variant={"overline"}>
                      No reviews
                    </Text>
                  )}
                </VStack>
              </Box>
            </VStack>
          </GridItem>
          <GridItem colSpan={{ lg: 2, sm: 0, md: 1 }}>
            <VStack gap={5} alignItems={"stretch"}>
              <BookingBox
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                setPrice={setPrice}
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                getValues={getValues}
                setSubject={setSubject}
                errors={errors}
                handleBooking={handleBooking}
                handleSubmit={handleSubmit}
                register={register}
                tutor={tutor}
              />
              <VStack alignItems={"stretch"}>
                <Text variant={"heading2"}>Tutor Location</Text>
                <iframe
                width="100%"
                height="400"
                src={`https://www.google.com/maps/embed/v1/place?key=${
                  import.meta.env.VITE_GOOGLE_API_KEY
                }
            &q=${tutor?.coordinates?.lat},${tutor?.coordinates?.lng}`}
              ></iframe>
              </VStack>
            </VStack>
          </GridItem>
        </Grid>
      )}
    </PanelLayout>
  );
};

export default BookTutor;
