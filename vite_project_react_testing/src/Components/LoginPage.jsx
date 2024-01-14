import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const onFinish = (values) => {
    const payload = { ...values };
    axios
      .post("http://localhost:5134/api/user/login", payload)
      .then((res) => {
        form.resetFields();
        message.success("Login Successfully");
        setIsloading(false);
        navigate("/chat");
      })
      .catch((err) => {
        console.log({ err });
        setIsloading(false);
        message.error("Something went wrong");
      });
  };
  return (
    <>
      {isLoading && <Spin />}
      <div className="p-4">
        <Form
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
                message: "Please input your Username!",
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
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ background: "blue" }}
              type="primary"
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
