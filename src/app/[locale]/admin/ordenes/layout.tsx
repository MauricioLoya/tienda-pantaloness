import Header from '@/modules/admin-dashboard/components/Header';
import React from 'react';
type Props = {
  children: React.ReactNode;
};
const OrdenesLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header
        title='📦 Ordenes de tu tienda online'
        description='Administra las ordenes de tu tienda, revisa el estado de las ordenes, actualizalos, lo que necesites.'
      />
      {children}
    </>
  );
};

export default OrdenesLayout;
