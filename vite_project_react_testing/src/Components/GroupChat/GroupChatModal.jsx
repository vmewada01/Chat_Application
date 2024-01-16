import { Button, Form, Input, Modal, Select, message } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";

const GroupChatModal = ({ isModalOpen, onClose, handleOk }) => {
  const { user, chats, setChats } = useContext(ChatContext);
  const [groupChatName, setGroupChatName] = useState(null);
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, searchIsLoading] = useState(false);
  const [form] = useForm();

  const onFinish = (values) => {};

  const handleChange = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5134/api/user`,
        config
      );

      setSearchResult(data);
      console.log({ data });
    } catch (error) {
      message.error("Failed to retrieve search results", error);
    }
  };

  useEffect(() => {
    handleChange();
  }, []);
  return (
    <Modal
      title={
        <p className="font-semibold flex justify-center items-center italic">
          Create Group Chat
        </p>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={onClose}
    >
      <div>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="chatName"
            rules={[
              {
                required: true,
                message: "Chat name is required",
              },
            ]}
          >
            <Input placeholder="Chat Name" />
          </Form.Item>
          <Form.Item
            name="usersName"
            rules={[
              {
                required: true,
                message: "users name is required",
              },
            ]}
          >
            <Select
              mode="multiple"
              allowClear={true}
              placeholder="select users"
              options={searchResult.map((item) => ({
                label: item.name,
                value: item.name,
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ background: "blue", float: "right" }}
              type="primary"
              htmlType="submit"
            >
              Create Chat
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default GroupChatModal;
