import React from 'react';

type Props = {
  headers: string[];
  data: { [key: string]: string | number | React.ReactNode }[];
  keyField?: string;
  renderCustomCell?: (header: string, row: React.ReactNode, index: number) => React.ReactNode;
};

const DisplayTableInfo: React.FC<Props> = ({ headers, data, keyField = '', renderCustomCell }) => {
  return (
    <div className='p-4'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='text-black bg-white divide-y divide-gray-200'>
            {data.map((row, rowIndex) => (
              <tr key={keyField && typeof row[keyField] === 'string' ? row[keyField] : rowIndex}>
                {headers.map((header, colIndex) => {
                  const propName = header
                    .toLowerCase()
                    .replace(/\s(.)/g, (_, char) => char.toUpperCase());
                  return (
                    <td key={colIndex} className='px-6 py-4 whitespace-nowrap'>
                      {row[propName] ?? row[header]}
                    </td>
                  );
                })}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={headers.length} className='px-6 py-4 text-center text-gray-500'>
                  No se encontraron datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayTableInfo;
