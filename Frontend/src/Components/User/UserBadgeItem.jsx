import { Tag } from "antd";
import React from "react";
const UserBadgeItem = ({ handleFunction, user, admin }) => {
  return (
    <>
      <Tag
        className="mb-3"
        closeIcon
        onClose={(e) => {
          e.preventDefault();
          handleFunction();
        }}
        bordered={true}
        color={admin === user._id ? "green" : "processing"}
      >
        {user.name}
      </Tag>
    </>
  );
};

export default UserBadgeItem;
