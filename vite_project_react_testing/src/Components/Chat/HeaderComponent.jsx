import {
  LogoutOutlined,
  SearchOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Tooltip, message } from "antd";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../Providers/ChatProvider";
import ProfileModal from "../Profile/ProfileModal";
import UserSearchDrawer from "../User/UserSearchDrawer";
const HeaderComponent = () => {
  const navigate = useNavigate();
  const [IsUserProfileModal, setIsUserProfileModal] = useState(false);
  const [IsUserSearchDrawer, setIsUserSearchDrawer] = useState(false);

  const { user } = useContext(ChatContext);
  console.log(user, "user");

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
        message.success("Logout Successfully");
        navigate("/");
      },
    },
  ];
  return (
    <div className="flex justify-between p-2">
      <div className="bg-green-500">
        <Tooltip placement="bottom" title={"Search Chat User here"}>
          <Button
            icon={<SearchOutlined />}
            onClick={() => setIsUserSearchDrawer(true)}
          >
            Search User
          </Button>
        </Tooltip>
      </div>
      <div className="bg-yellow-400">TALK-A-TIVE</div>
      <div className="bg-pink-500">
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
      />
      <UserSearchDrawer
        onOpen={IsUserSearchDrawer}
        onClose={() => setIsUserSearchDrawer(false)}
      />
    </div>
  );
};

export default HeaderComponent;
