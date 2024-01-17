import { UserOutlined } from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatContext } from "../../Providers/ChatProvider";
import { isLastMessage, isSameSender } from "../../config/ChatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = useContext(ChatContext);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          return (
            <div className="flex" key={i}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, m, i, user._id)) && (
                <>
                  <Tooltip label={m.sender.name} placement="bottom">
                    <Avatar icon={<UserOutlined />} />
                  </Tooltip>
                  <span className="bg-green-300 text-white rounded-lg p-5">
                    {m.content}
                  </span>
                </>
              )}
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
