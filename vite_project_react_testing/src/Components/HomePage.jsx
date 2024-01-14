import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Space, Tabs } from "antd";
import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="sticky-background">
      <div>
        <Card bordered={false} className="w-1/2 m-auto mt-2 ">
          <p className="flex justify-center text-purple-500 font-bold text-2xl ">
            ★★★ V-CHAT-APPLICATION ★★★
          </p>
        </Card>
      </div>
      <div className="shadow-lg p-4 w-1/2 m-auto mt-8 rounded-lg bg-white">
        <div className="flex p-3 justify-between">
          <Tabs
            defaultValue="login"
            centered={true}
            animated={{ inkBar: true, tabPane: true }}
            tabPosition="top"
            className="w-full"
          >
            <Tabs.TabPane
              tab={
                <Space>
                  <LockOutlined />
                  LOGIN
                </Space>
              }
              key="login"
            >
              <LoginPage />
            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <Space>
                  <UserOutlined />
                  SIGNUP
                </Space>
              }
              key="signup"
            >
              <SignupPage />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HomePage;