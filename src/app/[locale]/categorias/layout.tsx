import NavBar from '@/modules/landing/Navbar';
import React from 'react';
type Props = {
  children: React.ReactNode;
};
const CategoriesLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className='pt-28 max-w-7xl mx-auto'>{children}</div>
    </>
  );
};

export default CategoriesLayout;
