import NavBar from '@/modules/landing/Navbar'
import React from 'react'
type Props = {
  children: React.ReactNode
}
const CheckoutLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className="pt-20">{children}</div>
    </>
  )
}

export default CheckoutLayout
