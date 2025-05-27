import { createContext, useState } from "react";
import runChat from "../config/runChat";

export const AIContext = createContext();

const AIContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [provider, setProvider] = useState("openai");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const onSent = async (prompt) => {
    const query = input || prompt;
    setInput("");
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input || prompt);
    setPrevPrompts([...prevPrompts, input || prompt]);
    const response = await runChat(query, provider);
    console.log("recentPrompt", recentPrompt || prompt);
    console.log("resultData", resultData);
    console.log("prevPrompts", prevPrompts);

    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let formatted = newResponse.split("*").join("</br>").split(" ");
    formatted.forEach((word, i) => delayPara(i, word + " "));
    setLoading(false);
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    provider,
    setProvider,
  };

  return (
    <AIContext.Provider value={contextValue}>
      {props.children}
    </AIContext.Provider>
  );
};

export default AIContextProvider;
