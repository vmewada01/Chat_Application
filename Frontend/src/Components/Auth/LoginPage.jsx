import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Spin, Tooltip, message } from "antd";
import { useForm } from "antd/es/form/Form";

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Common/axios";

const LoginPage = ({ activeTab, isLoading, setIsloading }) => {
  const [form] = useForm();
  const navigate = useNavigate();
  const onFinish = (values) => {
    const payload = { ...values };
    setIsloading(true);
    axios
      .post("https://v-chat-app-kpbs.onrender.com/api/user/login", payload)
      .then((res) => {
        const userInformation = {
          name: res.data.name,
          email: res.data.email,
          picture: res.data.picture,
          userId: res.data._id,
          token: res.data.token,
        };

        localStorage.setItem("userInfo", JSON.stringify(userInformation));
        localStorage.setItem("v-chat-token", JSON.stringify(res?.data?.token));
        form.resetFields();
        message.success("Login Successfully");
        setIsloading(false);
        navigate("/chat");
      })
      .catch((err) => {
        setIsloading(false);
        err.response
          ? message.error(err?.response?.data?.message)
          : message.error("Something went wrong");
      });
  };

  useEffect(() => {
    if (activeTab === "signup") {
      form.resetFields();
    }
  }, [activeTab]);

  return (
    <>
      {isLoading && <Spin className="flex justify-center items-center" />}
      <div className="p-4">
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter email address",
              },
            ]}
          >
            <Input
              disabled={isLoading}
              prefix={
                <Tooltip title="User Email">
                  <MailOutlined className="site-form-item-icon" />
                </Tooltip>
              }
              placeholder="Email address"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter password",
              },
            ]}
          >
            <Input.Password
              disabled={isLoading}
              prefix={
                <Tooltip title="User Password">
                  <LockOutlined className="site-form-item-icon" />
                </Tooltip>
              }
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              type="password"
              placeholder="Enter password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              className="bg-blue-400 text-white"
              type="primary"
              disabled={isLoading}
              block
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
