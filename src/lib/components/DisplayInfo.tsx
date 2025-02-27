import React from 'react'
type Props = {
  info: { label: string; value: string | number | React.ReactNode }[]
}
const DisplayInfo: React.FC<Props> = ({ info }) => {
  return (
    <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        {info.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4"
          >
            <dt className="font-medium text-gray-900">{item.label}</dt>
            <dd className="text-gray-700 sm:col-span-2">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default DisplayInfo
