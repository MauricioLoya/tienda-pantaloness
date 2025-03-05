import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

type Props = {
  href: string;
};
const GoBack: React.FC<Props> = ({ href }) => {
  return (
    <Link
      className="flex items-center text-xs text-blue-500 hover:underline mb-4"
      href={href}
    >
      <FaArrowLeft className="mr-1" /> Atras
    </Link>
  );
};

export default GoBack;
