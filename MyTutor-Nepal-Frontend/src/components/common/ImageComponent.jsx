import { Box, Image, Input, Text, VStack } from "@chakra-ui/react";
import NoProfilePic from "../../assets/images/NoProfilePic.png";
import ImagePlaceholder from "../../assets/images/image_placeholder.png";
import { useRef } from "react";

const ImageComponent = ({
  width,
  height,
  text,
  image,
  handleImageChange,
  isProfileImg,
}) => {
  const inputRef = useRef(null);

  const handleImageClick = () => {
    inputRef.current.click();
  };
  return (
    <>
      <VStack alignItems={"start"}>
        <Text fontSize={"md"} color={"black"}>
          {text}
        </Text>
        <Box
          border={"1px"}
          borderStyle={"dashed"}
          _hover={{ cursor: "pointer" }}
          onClick={handleImageClick}
        >
          {image ? (
            <Image
              width={width}
              h={height}
              objectFit={"cover"}
              src={URL.createObjectURL(image)}
            />
          ) : isProfileImg ? (
            <Image
              width={width}
              h={height}
              objectFit={"cover"}
              src={NoProfilePic}
            />
          ) : (
            <Image
              width={width}
              h={height}
              objectFit={"cover"}
              src={ImagePlaceholder}
            />
          )}
          <Input
            type="file"
            hidden
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
