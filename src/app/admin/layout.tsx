import React from 'react'
import { auth } from '../auth'
import Link from 'next/link'
import NavBar from '@/modules/admin-dashboard/layout/NavBar'
type Props = {
  children: React.ReactNode
}
const AdminLayout: React.FC<Props> = async ({ children }) => {
  const session = await auth()

  if (!session?.user)
    return (
      <main>
        404
        <Link href="/">Back</Link>
      </main>
    )

  return (
    <main>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-white">
        <div className="w-full flex-none md:w-64">
          <NavBar />
        </div>
        <section className="flex-grow md:p-4 md:overflow-y-auto md:px-12">
          {children}
        </section>
      </div>
    </main>
  )
}

export default AdminLayout
