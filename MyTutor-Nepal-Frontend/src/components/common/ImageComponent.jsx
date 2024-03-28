import { Image, Text, VStack } from "@chakra-ui/react";
import NoProfilePic from "../../assets/images/NoProfilePic.png";
import ImagePlaceholder from "../../assets/images/image_placeholder.png";

const ImageComponent = ({
  title,
  src,
  isProfileImg,
  width,
  height,
  openable,
}) => {
  const handleClick = () => {
    // Open the image in a new tab when clicked
    window.open(`${import.meta.env.VITE_SERVER_PORT}/${src}`, "_blank");
  };
  return (
    <VStack alignItems={"start"}>
      <Text variant={"title1"}>{title}</Text>
      {src ? (
        <Image
          borderRadius={10}
          w={width}
          h={height}
          objectFit={"cover"}
          src={`${import.meta.env.VITE_SERVER_PORT}/${src}`}
          onClick={openable && handleClick}
          _hover={openable && { cursor: "pointer", filter: "blur(4px)" }}
        />
      ) : isProfileImg ? (
        <Image
          w={width}
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
    </VStack>
  );
};

export default ImageComponent;
