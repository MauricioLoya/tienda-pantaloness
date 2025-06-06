import { UserRepository } from '@/modules/user/definitions';
import React from 'react';
import UserDetails from '@/modules/user/components/UserDetails';
import HeaderContent from '@/lib/components/HeaderContent';
import UpdateUser from '@/modules/user/components/UpdateUser';
import ActivateUser from '@/modules/user/components/ActivateUser';
import DeleteUser from '@/modules/user/components/DeleteUser';
import { Can } from '@/lib/Can';
import UpdatePassword from '@/modules/token/components/UpdatePassword';
import { numericRouteGuard } from '@/lib/utils';

type Props = {
  params: Promise<{ id: string }>;
};

const UserDetailsPage: React.FC<Props> = async ({ params }) => {
  const id = numericRouteGuard((await params).id);

  const user = await new UserRepository().getById(Number(id));
  if (!user) {
    return <div>Usuario no encontrado</div>;
  }
  const actions = (
    <>
      <Can I="update" a="User">
        <UpdatePassword userId={user.id} />
        <UpdateUser user={user} />
        {user.isDeleted ? <ActivateUser user={user} /> : <DeleteUser user={user} />}
      </Can>
    </>
  );

  return (
    <>
      <HeaderContent title={`Detalle de ${user.email}`} href='./' action={actions} />
      <div className='flex flex-col gap-6 '>
        <UserDetails user={user} />
      </div>
    </>
  );
};

export default UserDetailsPage;
