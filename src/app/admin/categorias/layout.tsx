import Header from '@/modules/admin-dashboard/components/Header'
import React from 'react'
type Props = {
  children: React.ReactNode
}
const CategoriasLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header
        title="📝 Tus Categorias"
        description="Administra las categorias de tu tienda, agrega categorias, actualizalas, lo que"
      />
      {children}
    </>
  )
}

export default CategoriasLayout
