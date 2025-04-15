"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { RegionFreeShipping, RegionItem } from "../../region/definitions";
// import { saveSettingsAction } from "../actions/saveSettingsAction";
import { useToast } from '@/lib/components/ToastContext';
import { useRouter } from 'next/navigation';

interface SettingsFormValues {
  storeName: string;
  logoUrl: string;
  freeShippingByRegion: (RegionFreeShipping & { regularShippingPrice: number })[];
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
        regularShippingPrice: Yup.number()
          .min(0, "Debe ser un número positivo")
          .required("El precio de envío regular es requerido"),
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
      console.log("values", values);



      // await saveSettingsAction(values);
      // saveSettingsAction
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
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configuración de la Tienda</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values }) => (
          <Form className="space-y-8">
            {/* Información básica de la tienda */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Información General</h2>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Nombre de la tienda</label>
                  <Field
                    name="storeName"
                    type="text"
                    className="input input-bordered w-full"
                  />
                  <ErrorMessage
                    name="storeName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Logo (URL)</label>
                  <Field
                    name="logoUrl"
                    type="text"
                    className="input input-bordered w-full"
                  />
                  <ErrorMessage
                    name="logoUrl"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Ingresa la URL de tu logo. Recomendamos usar una imagen transparente.
                  </p>
                  {values.logoUrl && (
                    <div className="mt-3 border rounded p-2 inline-block">
                      <img
                        src={values.logoUrl}
                        alt="Vista previa del logo"
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Configuración de envíos por región */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Configuración de Envíos por Región</h2>

              <FieldArray name="freeShippingByRegion">
                {() => (
                  <div className="space-y-6">
                    {values.freeShippingByRegion.map((entry, index) => {
                      const region = regions.find(r => r.code === entry.regionCode);
                      return (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="text-xl">{region?.flag}</div>
                            <h3 className="text-lg font-medium">{region?.name}</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-1">
                                Monto para envío gratuito
                              </label>
                              <div className="flex items-center gap-2">
                                <Field
                                  name={`freeShippingByRegion[${index}].amount`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="Monto"
                                  className="input input-bordered w-full"
                                />
                                <span className="text-sm text-gray-600">
                                  {region?.currencyCode || '$'}
                                </span>
                              </div>
                              <ErrorMessage
                                name={`freeShippingByRegion[${index}].amount`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                              <p className="text-sm text-gray-500 mt-1">
                                A partir de este monto, el envío será gratuito para el cliente
                              </p>
                            </div>

                            <div>
                              <label className="block font-medium mb-1">
                                Precio regular de envío
                              </label>
                              <div className="flex items-center gap-2">
                                <Field
                                  name={`freeShippingByRegion[${index}].regularShippingPrice`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="Precio"
                                  className="input input-bordered w-full"
                                />
                                <span className="text-sm text-gray-600">
                                  {region?.currencyCode || '$'}
                                </span>
                              </div>
                              <ErrorMessage
                                name={`freeShippingByRegion[${index}].regularShippingPrice`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                              <p className="text-sm text-gray-500 mt-1">
                                Costo de envío que se aplicará cuando el pedido no alcance el monto mínimo
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center">
                            <Field
                              name={`freeShippingByRegion[${index}].enabled`}
                              type="checkbox"
                              className="checkbox mr-2"
                            />
                            <label className="cursor-pointer">
                              Habilitar envío gratuito condicional
                            </label>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 ml-6">
                            Si está deshabilitado, siempre se cobrará el precio regular de envío
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary px-6">
                Guardar configuración
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StoreSettings;
