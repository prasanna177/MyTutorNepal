import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

const RatingStar = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);
  return (
    <HStack>
      {[1, 2, 3, 4, 5].map((star, index) => {
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={star}
              onClick={() => setRating(star)}
            />
            <FaStar
              className="star"
              size={50}
              color={star <= (hover || rating) ? "#ffc107" : "e4e5e9"}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </HStack>
  );
};

export default RatingStar;
