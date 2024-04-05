import { FaHistory } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { Box } from "@chakra-ui/react";

const IconAssignmentHistory = ({ handleClick }) => {
  return (
    <Box
      mt={1}
      _hover={{ cursor: "pointer" }}
      color={"#5B3B8C"}
      onClick={handleClick}
    >
      <div
        data-tooltip-id="assignment-history-tooltip"
        data-tooltip-content="View assignment history"
      >
        <FaHistory />
      </div>
      <Tooltip
        id="assignment-history-tooltip"
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

export default IconAssignmentHistory;
