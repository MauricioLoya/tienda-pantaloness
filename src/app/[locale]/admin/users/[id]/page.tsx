import { UserRepository } from "@/modules/user/definitions";
import React from "react";
import UserDetails from "@/modules/user/components/UserDetails";
type Props = {
  params: { id: string };
};

const UserDetailsPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params;
  const userRepo = new UserRepository();
  const user = await userRepo.getById(Number(id));
  if (!user) {
    return <div>Usuario no encontrado</div>;
  }
  return <UserDetails user={user} />;
};

export default UserDetailsPage;