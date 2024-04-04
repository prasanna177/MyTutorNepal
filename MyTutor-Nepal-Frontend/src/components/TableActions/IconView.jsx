import { ViewIcon } from "@chakra-ui/icons";
import { Tooltip } from "react-tooltip";

const IconView = ({ handleClick,label }) => {
  return (
    <>
      <div data-tooltip-id="view-tooltip" data-tooltip-content={label}>
        <ViewIcon
          _hover={{ cursor: "pointer" }}
          color={"primary.0"}
          onClick={handleClick}
        />
      </div>
      <Tooltip
        id="view-tooltip"
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

export default IconView;
