import { Box, Image, Input, Text, VStack } from "@chakra-ui/react";
import NoProfilePic from "../../assets/images/NoProfilePic.png";
import ImagePlaceholder from "../../assets/images/image_placeholder.png";
import { useRef } from "react";

const ImageComponent = ({
  text,
  image,
  handleImageChange,
  register,
  name,
  isProfileImg,
}) => {
  const inputRef = useRef(null);

  const handleImageClick = () => {
    inputRef.current.click();
  };
  return (
    <>
      <VStack alignItems={"stretch"}>
        <Text fontSize={"md"} color={"black"}>
          {text}
        </Text>
        <Box
          _hover={{ cursor: "pointer" }}
          onClick={handleImageClick}
        >
          {image ? (
            <Image
              width={"200px"}
              h={"200px"}
              objectFit={"cover"}
              src={URL.createObjectURL(image)}
            />
          ) : isProfileImg ? (
            <Image
              width={"200px"}
              h={"200px"}
              objectFit={"cover"}
              src={NoProfilePic}
            />
          ) : (
            <Image
              width={"200px"}
              h={"200px"}
              objectFit={"cover"}
              src={ImagePlaceholder}
            />
          )}
          <Input
            {...register(name)}
            hidden
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={inputRef}
          />
        </Box>
      </VStack>
    </>
  );
};

export default ImageComponent;
