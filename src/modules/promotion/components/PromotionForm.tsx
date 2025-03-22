import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { RegionItem } from "@/modules/region/definitions";

export interface FormPromotionsValues {
  code: string;
  name: string;
  description: string;
  discount: number;
  startDate: Date | string;
  endDate: Date | string;
  active: boolean;
  regionId: string;
}

export interface PromotionFormProps {
  initialValues: FormPromotionsValues;
  onValuesChange: (values: FormPromotionsValues) => void;
  regions: RegionItem[];
}

export const PromotionSchema = Yup.object().shape({
  code: Yup.string()
    .required("El código es requerido")
    .matches(/^[a-zA-Z0-9]+$/, "Solo se permiten letras y números")
    .min(4, "Mínimo 4 caracteres")
    .max(10, "Máximo 10 caracteres"),
  name: Yup.string().required("El nombre es requerido"),
  description: Yup.string().required("La descripción es requerida"),
  discount: Yup.number()
    .min(0, "El descuento debe ser mayor o igual a 0")
    .required("El descuento es requerido"),
  startDate: Yup.date().required("La fecha de inicio es requerida"),
  endDate: Yup.date()
    .required("La fecha de fin es requerida")
    .min(
      Yup.ref("startDate"),
      "La fecha de fin debe ser posterior a la fecha de inicio"
    ),
  active: Yup.boolean(),
  regionId: Yup.string().required("La región es requerida"),
});

const FormObserver: React.FC<{ onChange: (values: FormPromotionsValues) => void }> = ({
  onChange,
}) => {
  const { values } = useFormikContext<FormPromotionsValues>();
  useEffect(() => {
    onChange(values);
  }, [values, onChange]);
  return null;
};

export interface PromotionFormHandle {
  submit: () => Promise<FormPromotionsValues>;
}

const PromotionForm = forwardRef<PromotionFormHandle, PromotionFormProps>(
  ({ initialValues, onValuesChange, regions }, ref) => {
    return (
      <div className="">
        <Formik
          initialValues={initialValues}
          validationSchema={PromotionSchema}
          onSubmit={(values) => {
            console.log("Form submitted with values:", values);
          }}
        >
          {({ submitForm, values, validateForm, setTouched }) => {
            useImperativeHandle(ref, () => ({
              submit: async () => {
                setTouched({
                  code: true,
                  name: true,
                  description: true,
                  discount: true,
                  startDate: true,
                  endDate: true,
                  regionId: true,
                  active: true,
                });
                const errors = await validateForm();
                if (Object.keys(errors).length > 0) {
                  return Promise.reject(errors);
                }
                await submitForm();
                return values;
              },
            }));
            return (
              <Form>
                <div className="mb-4">
                  <label className="block text-gray-700">Código:</label>
                  <Field
                    name="code"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                  />
                  <ErrorMessage name="code" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Nombre:</label>
                  <Field
                    name="name"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Descripción:</label>
                  <Field
                    name="description"
                    as="textarea"
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Descuento (%):</label>
                  <Field
                    name="discount"
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                  />
                  <ErrorMessage name="discount" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Fecha de inicio:</label>
                  <Field
                    name="startDate"
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                  />
                  <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Fecha de fin:</label>
                  <Field
                    name="endDate"
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                  />
                  <ErrorMessage name="endDate" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4 flex items-center">
                  <Field name="active" type="checkbox" className="mr-2" />
                  <label className="text-gray-700">Activo</label>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Región:</label>
                  <Field
                    as="select"
                    name="regionId"
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                  >
                    <option value="">Selecciona una región</option>
                    {regions.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.flag} {r.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="regionId" component="div" className="text-red-500 text-sm" />
                </div>
                <FormObserver onChange={onValuesChange} />
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
);

export default PromotionForm;