import { Tag } from "antd";
import React from "react";
const UserBadgeItem = ({ handleFunction, user }) => {
  return (
    <>
      <Tag
        className="mb-3"
        closeIcon
        onClose={handleFunction}
        bordered={true}
        color="processing"
      >
        {user.name}
      </Tag>
    </>
  );
};

export default UserBadgeItem;
