import React, { useContext } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import HeaderComponent from "./HeaderComponent";
import MainComponent from "./MainComponent";
import SiderComponent from "./SiderComponent";

const ChatComponent = () => {
  const { user } = useContext(ChatContext);

  return (
    user && (
      <div>
        <HeaderComponent />
        <div className="w-11/12 p-2 flex justify-between gap-2">
          <SiderComponent />
          <MainComponent />
        </div>
      </div>
    )
  );
};

export default ChatComponent;
