import Header from '@/modules/admin-dashboard/components/Header';
import React from 'react';
type Props = {
  children: React.ReactNode;
};
const SetionLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header
        title='🌟 Secciones de tu tienda online'
        description='Aquí puedes gestionar las secciones de tu tienda online'
      />
      {children}
    </>
  );
};

export default SetionLayout;
