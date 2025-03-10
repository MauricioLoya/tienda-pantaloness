import React from "react";
import GoBack from "./GoBack";
type Props = {
  title: string;
  href: string;
};
const HeaderContent: React.FC<Props> = ({ title, href }) => {
  return (
    <div className="justify-start">
      <GoBack href={href} />
      <h1 className="text-2xl font-semibold text-gray-900 my-2">{title}</h1>
    </div>
  );
};

export default HeaderContent;
