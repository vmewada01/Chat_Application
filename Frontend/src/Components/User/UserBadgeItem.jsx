import { Tag } from "antd";
import React from "react";
const UserBadgeItem = ({ handleFunction, user, admin }) => {
  return (
    <>
      <Tag
        className="mb-3"
        closeIcon={admin._id === user._id ? false : true}
        onClose={(e) => {
          e.preventDefault();
          handleFunction();
        }}
        bordered={true}
        color={admin._id === user._id ? "green" : "processing"}
      >
        {user.name} {admin._id === user._id && <span>|| Admin</span>}
      </Tag>
    </>
  );
};

export default UserBadgeItem;
