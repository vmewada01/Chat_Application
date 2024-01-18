import {
  ArrowUpOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Spin, message } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [form] = useForm();
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const onFinish = (values) => {
    const payload = { ...values, picture: imageUrl };

    axios
      .post("http://localhost:5134/api/user", payload)

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
        form.setFieldsValue({});
        message.success("Signup Successfully");
        setIsloading(false);
        navigate("/chat");
      })

      .catch((err) => {
        setIsloading(false);
        message.error("Something went wrong");
        form.resetFields();
      });
  };
  const handleFileUploadAtCloudinary = (event) => {
    const file = event.target?.files[0];
    setImageUrl(file);
  };

  return (
    <>
      {isLoading && <Spin />}
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
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
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
              prefix={<MailOutlined className="site-form-item-icon" />}
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
