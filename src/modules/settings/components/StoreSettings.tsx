"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { RegionFreeShipping, RegionItem } from "../../region/definitions";
import { saveSettingsAction } from "../actions/saveSettingsAction";
import { useToast } from '@/lib/components/ToastContext';
import { useRouter } from 'next/navigation';

interface SettingsFormValues {
  storeName: string;
  logoUrl: string;
  freeShippingByRegion: RegionFreeShipping[];
}

const validationSchema = Yup.object({
  storeName: Yup.string().required("El nombre de la tienda es obligatorio"),
  logoUrl: Yup.string()
    .url("Debe ser una URL válida")
    .required("El logo es obligatorio"),
  freeShippingByRegion: Yup.array()
    .of(
      Yup.object({
        regionCode: Yup.string().required("Región requerida"),
        amount: Yup.number()
          .min(0, "Debe ser un número positivo")
          .required("El monto es requerido"),
        enabled: Yup.boolean(),
      })
    )
    .min(1, "Debes definir al menos una región"),
});
interface Props {
  regions: RegionItem[];
  initialValues: SettingsFormValues;
}
const StoreSettings: React.FC<Props> = ({ initialValues, regions }) => {
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (values: SettingsFormValues) => {
    try {
      await saveSettingsAction(values);
      router.refresh();
      showToast('Configuraciones actualizadas correctamente', 'success');
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || 'Error al actualizadas las configuraciones', 'error');
      } else {
        showToast('Error desconocido al actualizadas la configuraciones', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values }) => (
          <Form className="space-y-4">
            <div>
              <label className="block font-medium">Nombre de la tienda</label>
              <Field
                name="storeName"
                type="text"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="storeName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-medium">Logo (URL)</label>
              <Field
                name="logoUrl"
                type="text"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="logoUrl"
                component="div"
                className="text-red-500 text-sm"
              />
              {values.logoUrl && (
                <img
                  src={values.logoUrl}
                  alt="Vista previa del logo"
                  className="mt-2 w-32 h-32 object-contain border rounded"
                />
              )}
            </div>

            <div>
              <label className="block font-medium mb-2">
                Costo de envío gratis por región
              </label>
              <FieldArray name="freeShippingByRegion">
                {() => (
                  <div className="space-y-3">
                    {values.freeShippingByRegion.map((entry, index) => {
                      const region = regions.find(r => r.code === entry.regionCode);
                      return (
                        <div key={index} className="flex gap-4 items-center">
                          <div className="w-1/3">
                            {region ? (
                              <span>{region.flag} {region.name}</span>
                            ) : (
                              <span>Región</span>
                            )}
                          </div>
                          <Field
                            name={`freeShippingByRegion[${index}].amount`}
                            type="number"
                            placeholder="Monto"
                            className="input input-bordered w-1/3"
                          />
                          <Field
                            name={`freeShippingByRegion[${index}].enabled`}
                            type="checkbox"
                            className="checkbox"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </FieldArray>
            </div>

            <button type="submit" className="btn btn-primary">
              Guardar ajustes
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StoreSettings;
