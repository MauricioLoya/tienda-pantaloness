import React from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export function GenericLink({ href, color = 'primary', icon: Icon, children, size = 'xs' }) {
  const className = `btn btn-${size} btn-${color} flex items-center justify-center md:justify-start`;
  return (
    <Link href={href} className={className}>
      {Icon && (
        <Icon
          className={`
            ${children ? 'mr-0 md:mr-1' : ''}
          `}
        />
      )}
      {/* ocultar texto en <md>, mostrar desde md en adelante */}
      <span className='hidden md:inline'>{children}</span>
    </Link>
  );
}

export function GenericButton({ onClick, color = 'primary', icon: Icon, children, size = 'xs' }) {
  const className = `btn btn-${size} btn-${color} flex items-center justify-center md:justify-start`;
  return (
    <button onClick={onClick} className={className}>
      {Icon && (
        <Icon
          className={`
            ${children ? 'mr-0 md:mr-1' : ''}
          `}
        />
      )}
      <span className='hidden md:inline'>{children}</span>
    </button>
  );
}

export function AddEntity({ href = '', size = 'xs' }) {
  return (
    <GenericLink href={href} color='primary' icon={FaPlus} size={size}>
      Agregar
    </GenericLink>
  );
}

export function DetailsEntity({ href, color = 'primary', size = 'xs' }) {
  return (
    <GenericLink href={href} color={color} icon={FaEdit} size={size}>
      Detalles
    </GenericLink>
  );
}

export function RemoveItem({ onClick, color = 'error', size = 'xs' }) {
  return (
    <GenericButton onClick={onClick} color={color} icon={FaTrash} size={size}>
      Remover
    </GenericButton>
  );
}
