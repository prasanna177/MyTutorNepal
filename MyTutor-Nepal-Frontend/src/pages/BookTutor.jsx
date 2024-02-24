import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import TextField from "../components/common/TextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import toast from "react-hot-toast";

const BookTutor = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();
  const [tutor, setTutor] = useState([]);
  // const [isAvailable, setIsAvailable] = useState();

  const getTutorData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/tutor/getTutorById",
        { tutorId: params.tutorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"), //Authorization must start with capital when posting to backend
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
    date: yup.string().required("Date is required"),
    time: yup.string().required("Time is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleBooking = async (data) => {
    try {
      console.log(data);
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:4000/api/user/book-tutor",
        {
          tutorId: params.tutorId,
          userId: user._id,
          tutorInfo: tutor,
          userInfo: user,
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
  return (
    <Layout>
      <Heading>Booking Page</Heading>
      <Text>Name: {tutor?.fullName}</Text>
      <Text>Fee: {tutor?.feePerClass}</Text>
      <Text>
        Timing{tutor?.timing?.startTime} - {tutor?.timing?.endTime}
      </Text>
      <Box as="form" onSubmit={handleSubmit(handleBooking)}>
        <Flex flexDir={"column"} width={"400px"}>
          <TextField
            type={"date"}
            name={"date"}
            errors={errors?.timing?.startTime?.message}
            register={register}
            placeholder={"Date"}
          ></TextField>
          <TextField
            type={"time"}
            name={"time"}
            errors={errors?.time?.message}
            register={register}
            placeholder={"Time"}
          />
        </Flex>
        <Button type="submit">Book now</Button>
      </Box>
    </Layout>
  );
};

export default BookTutor;
