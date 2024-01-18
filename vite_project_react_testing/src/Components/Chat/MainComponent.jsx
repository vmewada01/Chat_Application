import React, { useContext } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import SingleChat from "./SingleChat";

const MainComponent = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(ChatContext);
  return (
    <div
      style={{ height: "100vh", width: "100vh" }}
      className="flex items-center rounded-lg border-black p-3 flex-col w-full bg-white"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default MainComponent;
