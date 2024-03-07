import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import TextField from "../components/common/TextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import toast from "react-hot-toast";
import moment from "moment";
import PanelLayout from "../components/Layout/PanelLayout";

const BookTutor = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();
  const [tutor, setTutor] = useState([]);
  const [price, setPrice] = useState(0);
  const [subject, setSubject] = useState("");

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
    try {
      //to send total price to backend
      const fromDate = moment(data.fromDate, "YYYY-MM-DD");
      const toDate = moment(data.toDate, "YYYY-MM-DD");
      const numberOfDays = toDate.diff(fromDate, "days") + 1;
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:4000/api/user/book-tutor",
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
    <PanelLayout>
      <Heading>Booking Page</Heading>
      <Text>Name: {tutor?.fullName}</Text>
      <Text>Fee: {tutor?.feePerClass}</Text>
      <Text>
        Timing: {tutor?.timing?.startTime} - {tutor?.timing?.endTime}
      </Text>
      <Box as="form" onSubmit={handleSubmit(handleBooking)}>
        <Flex flexDir={"column"} width={"400px"}>
          <TextField
            type={"date"}
            name={"fromDate"}
            errors={errors?.fromDate?.message}
            register={register}
          />
          <TextField
            type={"date"}
            name={"toDate"}
            errors={errors?.toDate?.message}
            register={register}
          />
          <TextField
            type={"time"}
            name={"time"}
            errors={errors?.time?.message}
            register={register}
          />
          <FormControl isInvalid={Boolean(errors?.subject)}>
            <Select
              {...register("subject")}
              placeholder={"Select your subject"}
              onChange={(e) => {
                const selectedSubjectInfo = tutor?.teachingInfo.find(
                  (item) => item.subject === e.target.value
                );
                setPrice(selectedSubjectInfo?.price || 0);
                setSubject(selectedSubjectInfo?.price || "");
              }}
            >
              {tutor?.teachingInfo?.map((item, index) => (
                <option key={index} value={item.subject}>
                  {item.subject} - Rs. {item.price} per class
                </option>
              ))}
            </Select>
            {errors && (
              <FormErrorMessage>{errors?.subject?.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={Boolean(errors?.message)}>
            <Textarea
              {...register("message")}
              placeholder={"Enter your message here"}
            />
            {errors && (
              <FormErrorMessage>{errors?.message?.message}</FormErrorMessage>
            )}
          </FormControl>
        </Flex>
        <Button type="submit">Book now</Button>
      </Box>
    </PanelLayout>
  );
};

export default BookTutor;
