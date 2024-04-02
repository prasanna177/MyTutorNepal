import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import toast from "react-hot-toast";
import moment from "moment";
import PanelLayout from "../components/Layout/PanelLayout";
import BookingBox from "../components/BookingBox";

const BookTutor = () => {
  const [tutor, setTutor] = useState([]);
  const [price, setPrice] = useState(0);
  const [subject, setSubject] = useState("");

  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTutorData = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/tutor/getTutorById`,
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

  const schema = yup.object({
    fromDate: yup.string().required("Please enter the starting date"),
    toDate: yup.string().required("Please ending the ending date"),
    time: yup.string().required("Time is required"),
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Please write a message"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleBooking = async (data) => {
    console.log(data);
    try {
      //to send total price to backend
      const fromDate = moment(data.fromDate, "YYYY-MM-DD");
      const toDate = moment(data.toDate, "YYYY-MM-DD");
      const numberOfDays = toDate.diff(fromDate, "days") + 1;
      dispatch(showLoading());
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/book-tutor`,
        {
          tutorId: params.tutorId,
          userId: user._id,
          tutorInfo: tutor,
          userInfo: user,
          feePerClass: price,
          totalPrice: numberOfDays * price,
          subject,
          ...data,
        },
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

  console.log(tutor, "tutor");
  return (
    <PanelLayout title={"Booking Page"}>
      <Grid templateColumns="repeat(7, 1fr)" gap={4}>
        <GridItem colSpan={{ lg: 5, sm: 7, md: 6 }}>
          <Box>
            <Text>Name: {tutor?.fullName}</Text>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laboriosam illum repellat quod repudiandae ad similique et velit
              amet voluptates qui, in quo, porro, aliquam nostrum! Quaerat
              magnam illum repellendus quos quis architecto. Libero voluptas
              vero nam cumque sunt.
            </Text>
            <Text>Fee: {tutor?.feePerClass}</Text>
            <Text>
              Timing: {tutor?.timing?.startTime} - {tutor?.timing?.endTime}
            </Text>
          </Box>
        </GridItem>
        <GridItem colSpan={{ lg: 2, sm: 0, md: 1 }}>
          <VStack gap={5} alignItems={"stretch"}>
            <BookingBox
              setPrice={setPrice}
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
    </PanelLayout>
  );
};

export default BookTutor;
