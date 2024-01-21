import { CloseOutlined } from "@ant-design/icons";
import React from "react";
const UserBadgeItem = ({ handleFunction, user }) => {
  return (
    <div
      className="px-1 py-1 rounded-lg m-1 mb-2 font-semibold bg-yellow-700 cursor-pointer inline-block text-white"
      onClick={handleFunction}
    >
      <div className="flex gap-2">
        {user.name}
        <CloseOutlined />
      </div>
    </div>
  );
};

export default UserBadgeItem;
