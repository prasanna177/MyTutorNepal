import { FaRegLaugh, FaRegMeh, FaRegSadTear } from "react-icons/fa";

const SentimentFace = ({ sentiment, sentimentNum }) => {
  return (
    <>
      {sentimentNum === 1 ? (
        <FaRegLaugh color="green" size={30} />
      ) : sentimentNum === 0 ? (
        <FaRegMeh size={30} color="orange" />
      ) : sentimentNum === -1 ? (
        <FaRegSadTear size={30} color="red" />
      ) : null}
      {sentiment === "positive" ? (
        <FaRegLaugh color="green" size={30} />
      ) : sentiment === "neutral" ? (
        <FaRegMeh size={30} color="orange" />
      ) : sentiment === "negative" ? (
        <FaRegSadTear size={30} color="red" />
      ) : null}
    </>
  );
};

export default SentimentFace;
