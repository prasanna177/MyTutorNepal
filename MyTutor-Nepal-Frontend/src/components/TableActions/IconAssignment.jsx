import { Box } from "@chakra-ui/react";
import { MdAssignment } from "react-icons/md";
import { Tooltip } from "react-tooltip";

const IconAssignment = ({ handleClick }) => {
  return (
    <Box
      mt={1}
      _hover={{ cursor: "pointer" }}
      color={"#5B3B8C"}
      onClick={handleClick}
    >
      <div
        data-tooltip-id="assignment-tooltip"
        data-tooltip-content="Provide Assignment"
      >
        <MdAssignment />
      </div>
      <Tooltip
        id="assignment-tooltip"
        place="bottom"
        style={{
          zIndex: 9999,
          padding: "7px",
          backgroundColor: "#AEAEAE",
          color: "white",
          fontSize: "11px",
        }}
      />
    </Box>
  );
};

export default IconAssignment;
