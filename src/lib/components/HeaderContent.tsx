'use client'

import React from 'react'
import GoBack from './GoBack'

type HeaderContentProps = {
  title: string
  href: string
  action?: React.ReactNode
}

const HeaderContent: React.FC<HeaderContentProps> = ({
  title,
  href,
  action
}) => {
  return (
    <div className="p-2">
      <div>
        <GoBack href={href} />
      </div>
      <div className="flex items-center justify-between border-b pb-2 mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl self-end font-semibold text-gray-900">
            {title}
          </h1>
        </div>

        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </div>
  )
}

export default HeaderContent
