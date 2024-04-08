import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Select,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
  HStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import TextField from "./common/TextField";
import NormalButton from "./common/Button";

const BookingBox = ({
  setPrice,
  setSubject,
  errors,
  handleBooking,
  handleSubmit,
  register,
  isOpen,
  onOpen,
  onClose,
  getValues,
  paymentType,
  setPaymentType,
  tutor,
}) => {
  return (
    <>
      <Modal
        isCentered={true}
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={handleSubmit(() => {
            const data = getValues();
            handleBooking(data, paymentType);
          })}
        >
          <ModalHeader>
            <Text>Choose payment method</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup
              colorScheme="purple"
              onChange={setPaymentType}
              value={paymentType}
            >
              <VStack alignItems={"start"}>
                <Radio value="Khalti">Pay with khalti</Radio>
                <Radio value="Cash on delivery">Pay in person</Radio>
              </VStack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter>
            <NormalButton
              color="white"
              bgColor={"primary.0"}
              type="submit"
              text={"Book now"}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box p={"30px"} boxShadow={"lg"}>
        <Flex gap={2} flexDir={"column"}>
          <Text variant={"heading2"}>Book tutor now</Text>
          <TextField
            hasLabel={true}
            label={"From Date"}
            type={"date"}
            name={"fromDate"}
            errors={errors?.fromDate?.message}
            register={register}
          />
          <TextField
            hasLabel={true}
            label={"To Date"}
            type={"date"}
            name={"toDate"}
            errors={errors?.toDate?.message}
            register={register}
          />
          <TextField
            hasLabel={true}
            label={"Time"}
            type={"time"}
            name={"time"}
            errors={errors?.time?.message}
            register={register}
          />
          <VStack alignItems={"start"} w={"100%"}>
            <Text variant={"subtitle1"}>
              <span style={{ color: "red" }}>* </span>
              Subject
            </Text>
            <FormControl isInvalid={Boolean(errors?.subject)}>
              <Select
                {...register("subject")}
                placeholder={"Select your subject"}
                onChange={(e) => {
                  const selectedSubjectInfo = tutor?.teachingInfo.find(
                    (item) => item.subject === e.target.value
                  );
                  setPrice(selectedSubjectInfo?.price || 0);
                  setSubject(selectedSubjectInfo?.subject || "");
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
          </VStack>
          <VStack alignItems={"start"} w={"100%"}>
            <Text variant={"subtitle1"}>
              <span style={{ color: "red" }}>* </span>
              Enter your message
            </Text>
            <FormControl isInvalid={Boolean(errors?.message)}>
              <Textarea
                {...register("message")}
                placeholder={"Enter your message here"}
              />
              {errors && (
                <FormErrorMessage>{errors?.message?.message}</FormErrorMessage>
              )}
            </FormControl>
          </VStack>
        </Flex>
        <HStack mt={2}>
          <Button
            onClick={onOpen}
            w={"100%"}
            bg={"primary.0"}
            color={"white"}
            type="submit"
          >
            Book now
          </Button>
        </HStack>
      </Box>
    </>
  );
};

export default BookingBox;
