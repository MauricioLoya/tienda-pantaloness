"use client";

import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { CategoryInput } from "../definitions";
import { RegionItem } from "@/modules/region/definitions";

type CategoryFormProps = {
  initialData?: Partial<CategoryInput>;
  regions: RegionItem[];
  onValuesChange: (values: CategoryInput) => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData = {
    name: "",
    description: "",
    regionId: "",
  },
  regions,
  onValuesChange,
}) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    description: Yup.string().required("La descripción es requerida"),
    regionId: Yup.string().required("La región es requerida"),
  });
  const FormObserver: React.FC<{
    onChange: (values: CategoryInput) => void;
  }> = ({ onChange }) => {
    const { values } = useFormikContext<CategoryInput>();
    useEffect(() => {
      onChange(values);
    }, [values, onChange]);
    return null;
  };

  return (
    <div className="card shadow p-6 mb-6">
      <Formik
        initialValues={initialData as CategoryInput}
        validationSchema={validationSchema}
        onSubmit={(values) => {}}
      >
        <Form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <Field
              name="name"
              type="text"
              className="input input-bordered w-full"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <Field
              name="description"
              as="textarea"
              className="textarea textarea-bordered w-full"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Región
            </label>
            <Field
              as="select"
              name="regionId"
              className="select select-bordered w-full"
            >
              <option value="">Selecciona una región</option>
              {regions.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.flag} {r.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="regionId"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <FormObserver onChange={onValuesChange} />
        </Form>
      </Formik>
    </div>
  );
};

export default CategoryForm;
