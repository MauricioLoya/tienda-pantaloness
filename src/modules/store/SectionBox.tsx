import React from 'react'
type Props = {
  children: React.ReactNode
  className?: string
}
const SectionBox: React.FC<Props> = ({ children, className }) => {
  return (
    <section className={`max-w-5xl mx-auto px5 py-10 ${className}`}>
      {children}
    </section>
  )
}

export default SectionBox
