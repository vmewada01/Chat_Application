import {
  ArrowUpOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Spin, message } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useState } from "react";

const SignupPage = () => {
  const { form } = useForm();
  const [isLoading, setIsloading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const onFinish = (values) => {
    const payload = { ...values };
    axios
      .post("http://localhost:5134/api/user", payload)
      .then((res) => {
        form.resetFields();
        message.success("Login Successfully");
        setIsloading(false);
      })
      .catch((err) => {
        console.log({ err });
        setIsloading(false);
        message.error("Something went wrong");
      });
  };
  const handleFileUploadAtCloudinary = (event) => {
    console.log("event", event.target?.files[0]);
    const file = event.target?.files[0];
    if (file === undefined) {
      message.warning("Please select image");
      return;
    } else {
      setIsloading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "v-chat-application");
      data.append("cloud_name", "do0almimf");
      fetch("https://api.cloudinary.com/v1_1/do0almimf", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setImageUrl(data.url.toString());
          message.success("Upload successfully");
          setIsloading(false);
        })
        .catch((err) => {
          console.log({ err });
          setIsloading(false);
          message.error("Something went wrong");
        });
    }
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
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
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
