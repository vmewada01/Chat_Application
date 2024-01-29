import { UserAddOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Image, Space, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./Auth/LoginPage";
import SignupPage from "./Auth/SignupPage";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chat");
    }
  }, [window.location]);
  return (
    <div className="sticky-background">
      <div
        className="shadow-lg p-4 lg:w-1/2 md:w-3/4
       md:p-3 sm:w-3/4 sm:p-1  m-auto mt-8 rounded-lg bg-white"
      >
        <p className="flex justify-center items-center text-sky-600 font-bold text-2xl ">
          <Image
            src="./v-chat-app.png"
            preview={false}
            width={90}
            className="rounded-lg"
            alt="V-Chat Logo"
          />
        </p>
        <div className="flex p-3 justify-between">
          <Tabs
            defaultValue={activeTab}
            centered={true}
            onChange={handleTabChange}
            animated={{ inkBar: true, tabPane: true }}
            tabPosition="top"
            className="w-full"
          >
            <Tabs.TabPane
              tab={
                <Space>
                  <UserSwitchOutlined />
                  LOGIN
                </Space>
              }
              key="login"
            >
              <LoginPage activeTab={activeTab} />
            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <Space>
                  <UserAddOutlined />
                  SIGNUP
                </Space>
              }
              key="signup"
            >
              <SignupPage activeTab={activeTab} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
