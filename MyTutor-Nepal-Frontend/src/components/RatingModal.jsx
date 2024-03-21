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
import { removeTutor } from "../redux/features/tutorSlice";
import { useState } from "react";
import RatingStar from "./RatingStar";

const RatingModal = ({ ratingModal }) => {
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const { tutor } = useSelector((state) => state.tutor);
  const { user } = useSelector((state) => state.user);

  const handleClose = () => {
    dispatch(hideRatingModal());
    dispatch(removeTutor());
  };

  const handleSubmit = () => {
    if (!rating) {
      setError(true);
    }
    const data = { rating, review, tutorId: tutor._id, userId: user._id };
    console.log(data);
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
                  tutor?.profilePicUrl
                }`}
              />
              <Text variant={"heading3"} color={"primary.0"}>
                Provide rating and review for {tutor.fullName}
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
