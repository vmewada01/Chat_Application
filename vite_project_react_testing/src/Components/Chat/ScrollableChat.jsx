import { UserOutlined } from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatContext } from "../../Providers/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";

const ScrollableChat = ({ messages }) => {
  console.log({ recivedMessages: messages });
  const { user } = useContext(ChatContext);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const sameSender = isSameSender(messages, m, i, user.userId);
          const lastMessage = isLastMessage(messages, i, user.userId);

          console.log(sameSender, lastMessage, "information");
          return (
            <div className="flex m-1" key={i}>
              <>
                {(sameSender || lastMessage) && (
                  <Tooltip
                    title={m.sender.name}
                    placement="bottom"
                    className="mt-2"
                  >
                    <Avatar icon={<UserOutlined />} />
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user.userId ? "#90eeee" : "#cdffcd"
                    }`,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    marginLeft: isSameSenderMargin(messages, m, i, user.userId),
                    marginTop: isSameUser(messages, m, i, user.userId) ? 3 : 10,
                  }}
                >
                  {m.content}
                </span>
              </>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
