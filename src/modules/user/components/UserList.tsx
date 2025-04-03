import React from 'react';
import { UserRepository } from '../definitions';
import UserTable from './UserTable';

const UserList: React.FC = async () => {
  const userRepo = new UserRepository();
  const users = await userRepo.getAll();
  const usersWithPassword = users.map(user => ({
    ...user,
    password: '',
    deletedAt: user.deletedAt ?? null
  }));
  return (
    <>
      <div className='p-4'>
        <div className='flex justify-end items-center mb-4'></div>
        <UserTable values={usersWithPassword} />
      </div>
    </>
  );
};

export default UserList;
