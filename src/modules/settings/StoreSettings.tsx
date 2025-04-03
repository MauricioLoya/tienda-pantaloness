"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { RegionFreeShipping } from "../region/definitions";


interface SettingsFormValues {
  storeName: string;
  logoUrl: string;
  freeShippingByRegion: RegionFreeShipping[];
}

const initialValues: SettingsFormValues = {
  storeName: "Emporium test store",
  logoUrl: "",
  freeShippingByRegion: [],
};

const validationSchema = Yup.object({
  storeName: Yup.string().required("El nombre de la tienda es obligatorio"),
  logoUrl: Yup.string()
    .url("Debe ser una URL válida")
    .required("El logo es obligatorio"),
  freeShippingByRegion: Yup.array()
    .of(
      Yup.object({
        region: Yup.string().required("Región requerida"),
        amount: Yup.number()
          .min(0, "Debe ser un número positivo")
          .required("El monto es requerido"),
      })
    )
    .min(1, "Debes definir al menos una región"),
});

const StoreSettings: React.FC = () => {
  const handleSubmit = (values: SettingsFormValues) => {
    console.log("Valores del formulario:", values);
  };

  return (
    <div className="space-y-6 p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
                {({ push, remove }) => (
                  <div className="space-y-3">
                    {values.freeShippingByRegion.map((entry, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <Field
                          name={`freeShippingByRegion[${index}].region`}
                          placeholder="Región"
                          className="input input-bordered w-1/2"
                        />
                        <Field
                          name={`freeShippingByRegion[${index}].amount`}
                          type="number"
                          placeholder="Monto"
                          className="input input-bordered w-1/2"
                        />
                        <button
                          type="button"
                          className="btn btn-error btn-sm"
                          onClick={() => remove(index)}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline btn-primary btn-sm"
                      onClick={() => push({ region: "", amount: 0 })}
                    >
                      Agregar región
                    </button>
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
