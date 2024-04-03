import { FaQuestion, FaRegLaugh, FaRegMeh, FaRegSadTear } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const SentimentFace = ({ sentiment }) => {
  console.log(sentiment, "s");
  return (
    <>
      {sentiment === "positive" || sentiment === 1 ? (
        <FaRegLaugh color="green" size={30} />
      ) : sentiment === "neutral" || sentiment === 0 ? (
        <FaRegMeh size={30} color="orange" />
      ) : sentiment === "negative" || sentiment === -1 ? (
        <FaRegSadTear size={30} color="blue" />
      ) : sentiment === 2 ? (
        <div
          data-tooltip-id="question-mark"
          data-tooltip-content="Problem in the server. Your overall sentiment score will not be affected "
        >
          <FaQuestion size={30} color="red" />
        </div>
      ) : null}
      <Tooltip
        id="question-mark"
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

export default SentimentFace;
