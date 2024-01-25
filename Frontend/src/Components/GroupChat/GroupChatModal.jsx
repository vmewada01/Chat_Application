import { Button, Form, Input, Modal, Spin, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useContext, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
import axios from "../Common/axios";
import UserBadgeItem from "../User/UserBadgeItem";
import UserListItem from "../User/UserListItem";

const GroupChatModal = ({ isModalOpen, onClose, handleOk }) => {
  const { user, chats, setChats } = useContext(ChatContext);
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = useForm();

  const handleChange = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://v-chat-app-kpbs.onrender.com/api/user?search=${query}`,
        config
      );
      setIsLoading(false);
      setSearchResult(data);
    } catch (error) {
      setIsLoading(false);
      message.error("Failed to retrieve search results", error);
    }
  };

  const handleGroup = async (userToAdd) => {
    const userExit = await selectedUser.includes(userToAdd);
    if (userExit) {
      message.info("User already added");
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };

  const handleDelete = (deleteUser) => {
    setSelectedUser(selectedUser.filter((user) => user._id !== deleteUser._id));
  };
  const onFinish = async (values) => {
    if (!selectedUser) return message.warning("Please enter the chat name");
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const payload = {
        name: values.chatName,
        users: JSON.stringify(selectedUser.map((user) => user._id)),
      };

      const { data } = await axios.post(
        `https://v-chat-app-kpbs.onrender.com/api/chat/group`,
        payload,
        config
      );
      setIsLoading(false);
      setChats([data, ...chats]);
      onClose();
      message.success("Group chat created");
    } catch (error) {
      setIsLoading(false);
      message.error("Failed to create group chat", error);
    }
  };
  return (
    <Modal
      title={
        <p className="font-semibold flex justify-center items-center italic">
          Create Group Chat
        </p>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={() => {
        onClose();
        form.resetFields();
        form.setFieldsValue({});
      }}
      footer={false}
      destroyOnClose={true}
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
                message: "Group name is required",
              },
            ]}
          >
            <Input placeholder="Enter Group Name" />
          </Form.Item>
          <Form.Item name="usersName">
            <Input
              placeholder="Add User eg: Jatin, Safal, etc..."
              onChange={(e) => handleChange(e.target.value)}
            />
          </Form.Item>

          {selectedUser.map((user) => (
            <UserBadgeItem
              key={user.id}
              user={user}
              handleFunction={() => handleDelete(user)}
            />
          ))}

          {isLoading ? (
            <Spin className="flex justify-center items-center" />
          ) : (
            searchResult?.slice(0, 4).map((user) => (
              <div className="flex flex-wrap">
                <UserListItem
                  key={user._id}
                  singleUser={user}
                  handleUserAccess={() => handleGroup(user)}
                />
              </div>
            ))
          )}

          <Form.Item>
            <Button
              className="bg-blue-400 text-white float-right"
              type="primary"
              disabled={isLoading}
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
