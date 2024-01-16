import React, { useContext, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import HeaderComponent from "./HeaderComponent";
import MainComponent from "./MainComponent";
import SiderComponent from "./SiderComponent";

const ChatComponent = () => {
  const [chats, setChats] = useState([]);

  const { user } = useContext(ChatContext);
  // const fetchChats = async()=> {
  //   const {data} = await axios.get("http://localhost:5134/api/chat")
  // }
  console.log(user, "user");

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
