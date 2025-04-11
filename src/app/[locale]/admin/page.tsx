import Header from '@/modules/admin-dashboard/components/Header';
import AdminStats from '@/modules/admin-dashboard/components/AdminStats';
import React from 'react';

const AdminPage: React.FC = ({ searchParams }) => {
  return (
    <>
      <Header
        title='📈 Tu dashboard'
        description='Aquí puedes ver información relevante sobre el sistema.'
      />
      <AdminStats searchParams={searchParams} />
    </>
  );
};

export default AdminPage;
