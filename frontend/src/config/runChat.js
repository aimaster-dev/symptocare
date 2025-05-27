import axios from "axios";

const runChat = async (prompt, provider = "openai") => {
  try {
    const response = await axios.post("http://localhost:5000/chat", {
      provider: provider,
      messages: [
        { role: "user", content: prompt }
      ]
    });

    return response.data.reply;
  } catch (error) {
    console.error("Error calling chat API:", error);
    return "Something went wrong. Please try again later.";
  }
};

export default runChat;