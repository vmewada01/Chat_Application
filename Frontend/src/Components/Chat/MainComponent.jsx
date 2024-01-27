import React, { useContext } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import SingleChat from "./SingleChat";

const MainComponent = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(ChatContext);
  return (
    <div
      style={{ width: "100%" }}
      className={` md:flex md:items-center  md:border-black md:p-3 md:flex-col md:bg-white ${
        selectedChat ? "flex" : "hidden"
      }`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default MainComponent;
