async function query(data) {
  try {
    const response = await fetch(process.env.SENTIMENT_ENDPOINT, {
      headers: { Authorization: `Bearer ${process.env.SENTIMENT_TOKEN}` },
      method: "POST",
      body: JSON.stringify(data),
    });
    const result = await response.json();
    const highestSentiment = result[0]?.reduce((prev, current) => {
      return prev.score > current.score ? prev : current;
    });
    if (highestSentiment.label === "positive") {
      return 1;
    } else if (highestSentiment.label === "negative") {
      return -1;
    } else if (highestSentiment.label === "neutral") {
      return 0;
    }
  } catch (error) {
    throw new Error("Error fetching sentiment: " + error.message);
  }
}

module.exports = query;
