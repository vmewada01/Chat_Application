import { CloseOutlined } from "@ant-design/icons";
import React from "react";
const UserBadgeItem = ({ handleFunction, user }) => {
  return (
    <div
      className="px-2 py-2 rounded-lg m-1 mb-2 font-semibold bg-purple-600 cursor-pointer inline-block text-white"
      onClick={handleFunction}
    >
      {user.name}
      <CloseOutlined />
    </div>
  );
};

export default UserBadgeItem;
