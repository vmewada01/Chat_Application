import {
  ArrowUpOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Spin, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const onFinish = (values) => {
    // const data = new FormData();
    // data.append("name", values.name);
    // data.append("password", values.password);
    // data.append("email", values.email);
    // data.append("file", imageUrl);
    const payload = { ...values };

    axios
      .post(
        "http://localhost:5134/api/user",
        payload
        //  {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      )
      .then((res) => res.json())
      .then((res) => {
        console.log({ res });
        form.resetFields();
        message.success("Signup Successfully");
        setIsloading(false);
        navigate("/chat");
      })

      .catch((err) => {
        console.log({ err });
        setIsloading(false);
        message.error("Something went wrong");
      });
  };
  const handleFileUploadAtCloudinary = (event) => {
    const file = event.target?.files[0];
    setImageUrl(file);
  };
  console.log({ imageUrl });
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
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your EmailAddress!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
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
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item name="picture">
            <Input
              prefix={<ArrowUpOutlined className="site-form-item-icon" />}
              type="file"
              accept=".jpeg,.jpg,.png"
              onChange={handleFileUploadAtCloudinary}
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

export default SignupPage;
