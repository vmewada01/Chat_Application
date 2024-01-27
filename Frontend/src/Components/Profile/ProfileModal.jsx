import { Image, Modal } from "antd";
import React from "react";

const ProfileModal = ({ isModalOpen, onClose, handleOk, user }) => {
  return (
    <Modal
      title={
        <p className="font-semibold flex justify-center items-center italic">
          User Profile
        </p>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={onClose}
      footer={false}
    >
      <div>
        <div className="flex justify-center items-center">
          <Image
            className="w-10 h-20 rounded-md object-cover"
            src={user?.picture}
            alt="avatar"
            preview={false}
            width={80}
          />
        </div>
        <div className="flex justify-center items-center">
          <p className="text-center font-semibold">{user?.name}</p>
        </div>
        <div className="flex justify-center items-center">
          <p className="text-center font-semibold">Email: {user?.email}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
