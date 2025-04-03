'use client';
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label = '✕',
  className = 'btn btn-xs btn-circle btn-error',
}) => {
  return (
    <button type='button' onClick={onClick} className={className}>
      {label}
    </button>
  );
};

export default ActionButton;
