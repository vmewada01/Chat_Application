import React, { useContext } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import SingleChat from "./SingleChat";

const MainComponent = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(ChatContext);
  return (
    <div
      style={{ height: "90vh", width: "100%" }}
      className={`md:flex md:items-center md:rounded-lg md:border-black md:p-3 md:flex-col md:bg-white ${
        selectedChat ? "flex" : "hidden"
      }`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default MainComponent;
