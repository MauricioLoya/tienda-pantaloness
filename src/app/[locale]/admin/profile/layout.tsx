import Header from '@/modules/admin-dashboard/components/Header';
import React from 'react';
type Props = {
  children: React.ReactNode;
};
const SetionLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header
        title='🌟 Perfil'
        description='Aquí puedes gestionar tu perfil y la configuración de tu cuenta'
      />
      {children}
    </>
  );
};

export default SetionLayout;
