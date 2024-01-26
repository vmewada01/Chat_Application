import React, { useContext, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import HeaderComponent from "./HeaderComponent";
import MainComponent from "./MainComponent";
import SiderComponent from "./SiderComponent";

const ChatComponent = () => {
  const { user } = useContext(ChatContext);

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    user && (
      <div className="w-full h-screen">
        <HeaderComponent />
        <div className="w-full  flex justify-between  mt-12">
          <SiderComponent fetchAgain={fetchAgain} />
          <MainComponent
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        </div>
      </div>
    )
  );
};

export default ChatComponent;
