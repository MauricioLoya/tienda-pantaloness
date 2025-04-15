import Header from '@/modules/admin-dashboard/components/Header';
import React, { Suspense } from 'react';
import Loader from '@/lib/components/Loader';

type Props = {
  children: React.ReactNode;
};
const CategoriasLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header
        title='📝 Tus Categorias'
        description='Administra las categorias de tu tienda, agrega categorias, actualizalas, lo que'
      />
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </>
  );
};

export default CategoriasLayout;
