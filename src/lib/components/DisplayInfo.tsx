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
    <div className="flow-root rounded-lg border border-base-200 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-base-200 text-sm">
        {info.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-1 p-3 even:bg-base-200 sm:grid-cols-3 sm:gap-4"
          >
            <dt className="font-medium text-base-content">{item.label}</dt>
            <dd className="text-base-content/80 sm:col-span-2">
              {item.value}
              {item.copyable && (
                <span className="ml-2">
                  <CopyClipboard
                    text={String(item.value)}
                  />
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default DisplayInfo;
