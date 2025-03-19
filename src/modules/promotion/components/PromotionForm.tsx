"use client";

import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { deletePromotionAction } from "../actions/deletePromotionAction";

export interface PromotionFormProps {
  initialValues: FormPromotionsValues;
  onValuesChange: (values: FormPromotionsValues) => void;
}

export interface FormPromotionsValues {
  code: string;
  name: string;
  description: string;
  discount: number;
  startDate: Date | string;
  endDate: Date | string;
  active: boolean;
}

const FormObserver: React.FC<{
  onChange: (values: FormPromotionsValues) => void;
}> = ({ onChange }) => {
  const { values } = useFormikContext<FormPromotionsValues>();
  useEffect(() => {
    onChange(values);
  }, [values, onChange]);
  return null;
};

const PromotionForm: React.FC<PromotionFormProps> = ({
  initialValues,
  onValuesChange,
}) => {
  const [_, startTransition] = React.useTransition();
  const PromotionSchema = Yup.object().shape({
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
  });

  // const handleDelete = async () => {
  //   if (confirm("¿Estás seguro de eliminar esta promoción?")) {
  //     try {
  //       if (!id) throw new Error("ID no proporcionado");
  //       startTransition(async () => {
  //         await deletePromotionAction(Number(id));
  //         router.push("/admin/promociones");
  //       });
  //     } catch (error: any) {
  //       alert(error.message || "Error al eliminar la promoción");
  //     }
  //   }
  // };

  return (
    <div className="">
      <Formik
        initialValues={initialValues}
        validationSchema={PromotionSchema}
        onSubmit={(values) => {}}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Código:</label>
              <Field
                name="code"
                type="text"
                // disabled={mode === "detail"}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage
                name="code"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre:</label>
              <Field
                name="name"
                type="text"
                // disabled={mode === "detail"}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Descripción:</label>
              <Field
                name="description"
                as="textarea"
                // disabled={mode === "detail"}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Descuento (%):</label>
              <Field
                name="discount"
                type="number"
                step="0.01"
                // disabled={mode === "detail"}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage
                name="discount"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Fecha de inicio:</label>
              <Field
                name="startDate"
                type="date"
                // disabled={mode === "detail"}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage
                name="startDate"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Fecha de fin:</label>
              <Field
                name="endDate"
                type="date"
                // disabled={mode === "detail"}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage
                name="endDate"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4 flex items-center">
              <Field
                name="active"
                type="checkbox"
                // disabled={mode === "detail"}
                className="mr-2"
              />
              <label className="text-gray-700">Activo</label>
            </div>
            <FormObserver onChange={onValuesChange} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PromotionForm;
