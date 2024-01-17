import { Image } from "antd";
import React from "react";

const UserListItem = ({ singleUser, handleUserAccess }) => {
  console.log({ singleUser });
  return (
    <>
      <div
        onClick={handleUserAccess}
        className="cursor-pointer  flex  items-center hover:bg-lime-200 text-black "
      >
        <Image
          className="w-8 h-20 rounded-full"
          src={singleUser?.picture}
          preview={false}
          alt="avatar"
          width={40}
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
