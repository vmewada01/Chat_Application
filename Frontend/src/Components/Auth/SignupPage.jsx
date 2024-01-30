import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
  PictureOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Spin, Tooltip, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Common/axios";

const SignupPage = () => {
  const [form] = useForm();
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");

  const onFinish = async (values) => {
    setIsloading(true);
    const key = "116e3de6b32169f2df91d8d0183bd5c9";
    const formData = new FormData();
    formData.append("image", imageUrl);
    formData.append("key", key);

    try {
      // First API: Upload Image
      fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((imageData) => {
          const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            picture: imageData.data.url,
          };

          // Second API: Register User
          return axios.post(
            "https://v-chat-app-kpbs.onrender.com/api/user",
            payload
          );
        })
        .then((res) => {
          const userInformation = {
            name: res.data.name,
            email: res.data.email,
            picture: res.data.picture,
            userId: res.data._id,
            token: res.data.token,
          };

          localStorage.setItem("userInfo", JSON.stringify(userInformation));
          localStorage.setItem("v-chat-token", JSON.stringify(res.data.token));
          form.resetFields();
          form.setFieldsValue({});
          message.success("Signup Successfully");
          setIsloading(false);
          navigate("/chat");
        })
        .catch((error) => {
          setIsloading(false);
          message.error("Something went wrong");
          form.resetFields();
        });
    } catch (error) {
      setIsloading(false);
      message.error("Something went wrong");
      form.resetFields();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target?.files[0];
    setImageUrl(file);
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
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter your Username!",
              },
            ]}
          >
            <Input
              disabled={isLoading}
              prefix={
                <Tooltip title="User Name">
                  <UserOutlined className="site-form-item-icon" />
                </Tooltip>
              }
              placeholder="User Name"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your EmailAddress!",
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
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="file"
            rules={[
              {
                required: true,
                message: "Please upload your profile picture!",
              },
            ]}
          >
            <Input
              prefix={
                <Tooltip title="Profile Picture">
                  <PictureOutlined className="site-form-item-icon" />
                </Tooltip>
              }
              disabled={isLoading}
              placeholder="Upload Profile Picture"
              type="file"
              onChange={handleFileUpload}
            />
          </Form.Item>

          <Form.Item>
            <Button
              disabled={isLoading}
              className="bg-blue-400 text-white"
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

export default SignupPage;
