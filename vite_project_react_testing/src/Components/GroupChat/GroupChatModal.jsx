import { Button, Form, Input, Modal, Spin, message } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useContext, useState } from "react";
import { ChatContext } from "../../Providers/ChatProvider";
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
        `http://localhost:5134/api/user?search=${query}`,
        config
      );
      setIsLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log({ error });
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
        `http://localhost:5134/api/chat/group`,
        payload,
        config
      );

      setChats([data, ...chats]);
      onClose();
      message.success("Group chat created");
    } catch (error) {}
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

          {/* selected users 
         render searched users */}
          {isLoading ? (
            <Spin />
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
