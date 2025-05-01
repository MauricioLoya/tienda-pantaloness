"use client";

import React from "react";
import { ErrorMessage, Field } from "formik";

const daysOfWeek = [
  { id: "monday", label: "Lunes" },
  { id: "tuesday", label: "Martes" },
  { id: "wednesday", label: "Miércoles" },
  { id: "thursday", label: "Jueves" },
  { id: "friday", label: "Viernes" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

interface BusinessHour {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface BusinessHoursComponentProps {
  businessHours: BusinessHour[];
  setFieldValue: (field: string, value: unknown) => void;
}

const BusinessHoursComponent: React.FC<BusinessHoursComponentProps> = ({
  businessHours,
  setFieldValue
}) => {
  // Function to toggle the isOpen state for a specific day
  const toggleDayOpen = (index: number) => {
    const updatedHours = [...businessHours];
    updatedHours[index].isOpen = !updatedHours[index].isOpen;
    setFieldValue('contactInfo.businessHours', updatedHours);
  };

  // Function to copy hours from one day to all other days
  const copyToAllDays = (fromIndex: number) => {
    const sourceDay = businessHours[fromIndex];
    const updatedHours = businessHours.map(day => ({
      ...day,
      isOpen: sourceDay.isOpen,
      openTime: sourceDay.openTime,
      closeTime: sourceDay.closeTime
    }));
    setFieldValue('contactInfo.businessHours', updatedHours);
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left">Día</th>
            <th className="text-center">Abierto</th>
            <th className="text-left">Hora Apertura</th>
            <th className="text-left">Hora Cierre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {businessHours?.map((daySchedule, index) => {
            const day = daysOfWeek.find(d => d.id === daySchedule.day);
            return (
              <tr key={daySchedule.day} className="border-b">
                <td className="py-3 font-medium">{day?.label}</td>
                <td className="py-3 text-center">
                  <label className="cursor-pointer flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={daySchedule.isOpen}
                      onChange={() => toggleDayOpen(index)}
                      className="toggle toggle-primary"
                    />
                  </label>
                </td>
                <td className="py-3">
                  <Field
                    type="time"
                    name={`contactInfo.businessHours[${index}].openTime`}
                    disabled={!daySchedule.isOpen}
                    className={`input input-bordered w-full max-w-xs ${!daySchedule.isOpen ? 'bg-gray-100 text-gray-400' : ''}`}
                  />
                  <ErrorMessage
                    name={`contactInfo.businessHours[${index}].openTime`}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </td>
                <td className="py-3">
                  <Field
                    type="time"
                    name={`contactInfo.businessHours[${index}].closeTime`}
                    disabled={!daySchedule.isOpen}
                    className={`input input-bordered w-full max-w-xs ${!daySchedule.isOpen ? 'bg-gray-100 text-gray-400' : ''}`}
                  />
                  <ErrorMessage
                    name={`contactInfo.businessHours[${index}].closeTime`}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    onClick={() => copyToAllDays(index)}
                    className="btn btn-xs btn-outline"
                    title="Aplicar este horario a todos los días"
                  >
                    Copiar a todos
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessHoursComponent;