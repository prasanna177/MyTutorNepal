import { CheckIcon } from "@chakra-ui/icons";
import { Tooltip } from "react-tooltip";

const IconCheck = ({ handleClick, label }) => {
  return (
    <>
      <div data-tooltip-id="mark-tooltip" data-tooltip-content={label}>
        <CheckIcon
          _hover={{ cursor: "pointer" }}
          color={"primary.0"}
          onClick={handleClick}
        />
      </div>
      <Tooltip
        id="mark-tooltip"
        place="bottom"
        style={{
          zIndex: 9999,
          padding: "7px",
          backgroundColor: "#AEAEAE",
          color: "white",
          fontSize: "11px",
        }}
      />
    </>
  );
};

export default IconCheck;
