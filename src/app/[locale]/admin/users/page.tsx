import Loader from "@/lib/components/Loader";
import CreateUser from "@/modules/user/components/CreateUser";
import UserList from "@/modules/user/components/UserList";
import React, { Suspense } from "react";

const UserPage: React.FC = async () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className="flex items-center justify-end border-b pb-2 mb-4">
          <CreateUser />
        </div>
        <UserList />
      </Suspense>
    </>
  );
};

export default UserPage;
