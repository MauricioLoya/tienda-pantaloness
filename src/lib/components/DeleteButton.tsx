'use client';

import React from "react";
import { FaTrash } from "react-icons/fa";

type DeleteButtonProps = {
  label?: string;
  color?: string;
  onClick: () => void;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ label = "Eliminar", onClick }) => {
  return (
    <button onClick={onClick} className="btn btn-error btn-sm flex items-center gap-2">
      <FaTrash />
      <span>{label}</span>
    </button>
  );
};

export default DeleteButton;
