import { UserOutlined } from "@ant-design/icons";
import { Avatar, Spin, Tooltip } from "antd";
import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatContext } from "../../Providers/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";

const ScrollableChat = ({ messages, isSendingMessage }) => {
  const { user } = useContext(ChatContext);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const sameSender = isSameSender(messages, m, i, user.userId);
          const lastMessage = isLastMessage(messages, i, user.userId);

          return (
            <div className="flex m-1 item-center " key={i}>
              <>
                {(sameSender || lastMessage) && (
                  <Tooltip
                    title={m.sender.name}
                    placement="bottom"
                    className="mt-3 mr-1"
                  >
                    <Avatar src={m?.sender?.picture} icon={<UserOutlined />} />
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user.userId ? "#EEF5FF" : "#cdffcd"
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
      {isSendingMessage && (
        <Spin className="flex m-1 justify-center items-center" />
      )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
