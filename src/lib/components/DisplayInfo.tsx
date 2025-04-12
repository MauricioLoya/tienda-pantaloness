'use client';

import React, { ReactNode } from 'react';
import CopyClipboard from './CopyClipboard';

type InfoItem = {
  label: string;
  value: string | number | boolean | ReactNode | null;
  copyable?: boolean;
  onCopy?: () => void;
};

type Props = {
  info: InfoItem[];
};

const DisplayInfo: React.FC<Props> = ({ info }) => {
  return (
    <div className="space-y-4">
      {info.map((item) => (
        <div key={item.label} className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">{item.label}</span>
            {item.copyable && (
              <CopyClipboard text={String(item.value)} />
            )}
          </div>
          <div className="mt-1 text-gray-900">
            {typeof item.value === 'boolean'
              ? item.value
                ? 'Sí'
                : 'No'
              : item.value || 'No disponible'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayInfo;
