import {
  BellOutlined,
  LogoutOutlined,
  SearchOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Image,
  Menu,
  Tooltip,
  message,
} from "antd";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../Providers/ChatProvider";
import { getSender } from "../../config/ChatLogics";
import ProfileModal from "../Profile/ProfileModal";
import UserSearchDrawer from "../User/UserSearchDrawer";
const HeaderComponent = () => {
  const navigate = useNavigate();
  const [IsUserProfileModal, setIsUserProfileModal] = useState(false);
  const [IsUserSearchDrawer, setIsUserSearchDrawer] = useState(false);

  const { user, notification, setSelectedChat, setNotification } =
    useContext(ChatContext);

  const items = [
    {
      label: "My Profile",
      key: "/user/self/detail",
      icon: <UserAddOutlined />,
      onClick: () => {
        setIsUserProfileModal(true);
      },
    },
    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
      onClick: async () => {
        await localStorage.removeItem("userInfo");
        await localStorage.removeItem("v-chat-token");
        message.success("Logout successfully");
        navigate("/");
      },
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "#B4D4FF",
      }}
      className="flex justify-between p-2"
    >
      <div>
        <Tooltip placement="bottom" title={"Search Existing User here"}>
          <Button
            icon={<SearchOutlined />}
            onClick={() => setIsUserSearchDrawer(true)}
            className="border-black"
          >
            Search User
          </Button>
        </Tooltip>
      </div>
      <div className="flex justify-center items-center">
        <Image
          src="./v-chat-app.png"
          preview={false}
          width={40}
          className="rounded-lg"
          alt="V-Chat Logo"
        />
      </div>
      <div>
        <Badge count={notification.length}>
          <Dropdown
            overlay={
              <Menu>
                {notification.length ? (
                  notification.map((item) => (
                    <Menu.Item
                      key={item.id}
                      onClick={() => {
                        setSelectedChat(item.chat);
                        setNotification(
                          notification.filter((notif) => notif !== item)
                        );
                      }}
                    >
                      {item.chat.isGroupChat
                        ? `New Message in ${item.chat.chatName}`
                        : `New Message from ${getSender(
                            user,
                            item.chat.users
                          )}`}
                    </Menu.Item>
                  ))
                ) : (
                  <Menu.Item disabled>No New Messages Available</Menu.Item>
                )}
              </Menu>
            }
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <Avatar icon={<BellOutlined />} shape="circle" size="small" />
            </a>
          </Dropdown>
        </Badge>

        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <Button
            style={{ color: "neutral" }}
            size="middle"
            icon={<UserOutlined style={{ color: "neutral" }} />}
            type="text"
            className="font-semibold tracking-widest"
          >
            {user?.name}
          </Button>
        </Dropdown>
      </div>
      <ProfileModal
        isModalOpen={IsUserProfileModal}
        onClose={() => setIsUserProfileModal(false)}
        handleOk={() => setIsUserProfileModal(false)}
        user={user}
      />
      <UserSearchDrawer
        onOpen={IsUserSearchDrawer}
        onClose={() => setIsUserSearchDrawer(false)}
      />
    </div>
  );
};

export default HeaderComponent;
