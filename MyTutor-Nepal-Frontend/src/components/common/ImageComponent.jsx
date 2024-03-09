import { Image, Text, VStack } from "@chakra-ui/react";
import NoProfilePic from "../../assets/images/NoProfilePic.png";
import ImagePlaceholder from "../../assets/images/image_placeholder.png";

const ImageComponent = ({ title, src, isProfileImg, width, height }) => {
  return (
    <VStack alignItems={"start"}>
      <Text variant={"title1"}>{title}</Text>
      {src ? (
        <Image width={width} h={height} objectFit={"cover"} src={src} />
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
    </VStack>
  );
};

export default ImageComponent;
