import React, { useContext } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import SingleChat from "./SingleChat";

const MainComponent = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(ChatContext);
  return (
    <div
      style={{ height: "90vh", width: "100%" }}
      className="flex items-center rounded-lg border-black p-3 flex-col bg-white"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default MainComponent;
