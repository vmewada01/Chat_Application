import React, { useContext } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import SingleChat from "./SingleChat";

const MainComponent = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(ChatContext);
  return (
    <div
      style={{ width: "100%" }}
      className={` md:flex md:items-center  md:border-black py-1 md:p-1 md:flex-col md:bg-white ${
        selectedChat ? "flex" : "hidden"
      }`}
      z
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default MainComponent;
