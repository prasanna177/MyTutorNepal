import {
  Avatar,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { hideRatingModal } from "../redux/features/ratingSlice";
import { useDispatch, useSelector } from "react-redux";
import NormalButton from "./common/Button";
import { removeAppointment } from "../redux/features/appointmentSlice";
import { useState } from "react";
import RatingStar from "./RatingStar";
import { removeNotification } from "../redux/features/notificationIdSlice";
import axios from "axios";
import toast from "react-hot-toast";

const RatingModal = ({ ratingModal }) => {
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const { appointment } = useSelector((state) => state.appointment);
  const { notificationId } = useSelector((state) => state.notificationId);

  const handleClose = () => {
    dispatch(hideRatingModal());
    dispatch(removeAppointment());
    dispatch(removeNotification());
  };

  const handleSubmit = async () => {
    try {
      if (!rating) {
        setError(true);
      }
      const data = {
        rating,
        review,
        appointmentId: appointment._id,
        tutorId: appointment.tutorId,
        userId: appointment.userId,
        notificationId,
      };
      console.log(data);
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/rate-tutor`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleSkipRating = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/skip-tutor-rating`,
        {
          userId: appointment.userId,
          notificationId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
      handleClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Modal isOpen={ratingModal} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Avatar
                size={"md"}
                src={`${import.meta.env.VITE_SERVER_PORT}/${
                  appointment?.tutorInfo?.profilePicUrl
                }`}
              />
              <Text variant={"heading3"} color={"primary.0"}>
                Provide rating and review for {appointment?.tutorInfo?.fullName}
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={3} alignItems={"start"}>
              <RatingStar rating={rating} setRating={setRating} />
              {error && <Text variant={"error"}>Please provide a rating.</Text>}
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Provide your review"
                maxLength={1613}
              />
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <NormalButton
              bgColor={"primary.0"}
              color={"white"}
              text={"Submit"}
              onClick={handleSubmit}
            />
            <Text
              onClick={handleSkipRating}
              _hover={{ cursor: "pointer", textDecoration: "underline" }}
              variant={"subtitle2"}
            >
              No thanks
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RatingModal;
