import React, { useContext } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import UpdateGroupChatModal from "../GroupChat/UpdateGroupChatModal";
import ProfileModal from "../Profile/ProfileModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  console.log(selectedChat, "selected");

  return (
    <div className="w-full h-full">
      {selectedChat ? (
        <>
          <div className="flex flex-col items-center content-center w-full">
            {!selectedChat?.isGroupChat ? (
              <>
                {getSender(user, selectedChat?.users)}
                <ProfileModal user={getSenderFull(user, selectedChat?.users)} />
                <div className="flex flex-col justify-end p-3 bg-slate-400 rounded-lg overflow-hidden w-full h-full">
                  Message will be displayed here
                </div>
              </>
            ) : (
              <div className="flex justify-between w-full">
                {selectedChat?.chatName?.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center content-center h-full">
            <p className="text-2xl italic">Click on a user to start chatting</p>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleChat;
