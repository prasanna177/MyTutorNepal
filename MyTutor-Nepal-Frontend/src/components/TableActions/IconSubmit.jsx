import { EditIcon } from "@chakra-ui/icons";
import { Tooltip } from "react-tooltip";

const IconSubmit = ({ handleClick }) => {
  return (
    <>
      <div data-tooltip-id="submit-tooltip" data-tooltip-content="Submit assignment">
        <EditIcon
          _hover={{ cursor: "pointer" }}
          color={"primary.0"}
          onClick={handleClick}
        />
      </div>
      <Tooltip
        id="submit-tooltip"
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

export default IconSubmit;
