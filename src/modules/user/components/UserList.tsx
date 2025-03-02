import React from "react";
import { UserRepository } from "../definitions";
import UserTable from "./UserTable";
import UserAddButton from "./UserAddButton";

const UserList: React.FC = async () => {
  const userRepo = new UserRepository();
  const users = await userRepo.getAll();
  return (
    <>
      <div className="flex justify-end items-center mb-4">
        <UserAddButton />
      </div>
      <UserTable values={users} />
    </>
  );
};

export default UserList;
