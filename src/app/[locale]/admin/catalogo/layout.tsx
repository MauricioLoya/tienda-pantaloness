import Header from '@/modules/admin-dashboard/components/Header';
import React from 'react';
type Props = {
  children: React.ReactNode;
};
const CatalogoLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header
        title='👖 Catálogo de tu tienda online'
        description='Administra el catálogo de tu tienda, agrega productos, actualizalos, lo que necesites.'
      />
      {children}
    </>
  );
};

export default CatalogoLayout;
