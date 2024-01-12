import axios from "axios";
import React, { useEffect, useState } from "react";

const ChatComponent = () => {
  const [data, setData] = useState([]);

  const fetchChatFucntion = async () => {
    const { data } = await axios.get("http://localhost:5000/api/chat");
    setData(data);
  };
  useEffect(() => {
    fetchChatFucntion();
  }, []);
  console.log({ data });
  return (
    <div>
      <h1 className="font-semibold text-red-400 flex justify-center text-3xl">
        welcome to chat page
      </h1>
      <div>
        {data?.map((item) => {
          return <h2>{item?.chatName}</h2>;
        })}
      </div>
    </div>
  );
};

export default ChatComponent;
