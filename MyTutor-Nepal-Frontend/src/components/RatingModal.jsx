import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { hideRatingModal } from "../redux/features/ratingSlice";
import { useDispatch, useSelector } from "react-redux";
import NormalButton from "./common/Button";
import { removeTutor } from "../redux/features/tutorSlice";

const RatingModal = ({ ratingModal }) => {
  const dispatch = useDispatch();
  const { tutor } = useSelector((state) => state.tutor);
  const handleClose = () => {
    dispatch(hideRatingModal());
    dispatch(removeTutor());
  };

  return (
    <>
      <Modal isOpen={ratingModal} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Provide rating for this tutor {tutor.fullName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
          <ModalFooter w={"100%"}>
            <NormalButton
              bgColor={"primary.0"}
              color={"white"}
              text={"Submit"}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RatingModal;
