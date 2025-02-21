import React from 'react'
import { auth } from '../auth'
import Link from 'next/link'
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

  return <main>{children}</main>
}

export default AdminLayout
