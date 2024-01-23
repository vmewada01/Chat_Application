import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Spin, message } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
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
        form.resetFields();
        message.success("Login Successfully");
        setIsloading(false);
        navigate("/chat");
      })
      .catch((err) => {
        setIsloading(false);
        message.error("Something went wrong");
      });
  };
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
                message: "Please enter your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email Address"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              type="password"
              placeholder="Password"
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
