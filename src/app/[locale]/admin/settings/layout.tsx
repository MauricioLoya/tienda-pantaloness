import Header from '@/modules/admin-dashboard/components/Header';
import React from 'react';
type Props = {
  children: React.ReactNode;
};
const SettingsLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header
        title='Configuracion'
        description='Configura tu tienda a tu gusto'
      />
      {children}
    </>
  );
};

export default SettingsLayout;
