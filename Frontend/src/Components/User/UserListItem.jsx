import { Image } from "antd";
import React from "react";

const UserListItem = ({ singleUser, handleUserAccess }) => {
  return (
    <>
      <div
        onClick={handleUserAccess}
        className="cursor-pointer mt-2 mb-2 flex gap-3 rounded-md items-center hover:bg-gray-300  text-black w-full "
      >
        <Image
          className="rounded-full object-cover"
          src={singleUser?.picture}
          preview={false}
          alt="avatar"
          style={{ width: "30px", height: "40px" }}
        />

        <div className="flex flex-col">
          <p className="text-lg">{singleUser?.name}</p>
          <p className="text-center font-semibold">{singleUser?.email}</p>
        </div>
      </div>
    </>
  );
};

export default UserListItem;
