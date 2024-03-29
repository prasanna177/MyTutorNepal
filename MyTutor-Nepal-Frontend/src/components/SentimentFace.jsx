import { FaRegLaugh, FaRegMeh, FaRegSadTear } from "react-icons/fa";

const SentimentFace = ({ sentiment }) => {
  console.log(sentiment, "s");
  return (
    <>
      {sentiment === "positive" || sentiment === 1 ? (
        <FaRegLaugh color="green" size={30} />
      ) : sentiment === "neutral" || sentiment === 0 ? (
        <FaRegMeh size={30} color="orange" />
      ) : sentiment === "negative" || sentiment === -1 ? (
        <FaRegSadTear size={30} color="red" />
      ) : null}
    </>
  );
};

export default SentimentFace;
