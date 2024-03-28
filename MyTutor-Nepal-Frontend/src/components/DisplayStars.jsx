import { StarIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

const DisplayStars = ({ rating }) => {
  return (
    <Box display="flex" alignItems="center">
      {Array(5)
        .fill("")
        .map((_, i) => (
          <StarIcon
            boxSize={3}
            key={i}
            color={i < rating ? "orange" : "gray.300"}
          />
        ))}
    </Box>
  );
};

export default DisplayStars;
