import NavBar from '@/modules/landing/Navbar'
import React from 'react'
type Props = {
  children: React.ReactNode
}
const ProductosLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className="pt-28">{children}</div>
    </>
  )
}

export default ProductosLayout
