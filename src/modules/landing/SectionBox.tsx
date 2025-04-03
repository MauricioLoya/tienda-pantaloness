import React from 'react';
type Props = {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
};
const SectionBox: React.FC<Props> = ({ children, className, bgColor }) => {
  return (
    <section className={`${bgColor}`}>
      <div className={`mx-auto max-w-7xl px-5 py-10 ${className}`}>{children}</div>
    </section>
  );
};

export default SectionBox;
