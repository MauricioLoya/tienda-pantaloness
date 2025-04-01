"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { RegionItem } from "@/modules/region/definitions";
import Loader from "@/lib/components/Loader";
import { SectionType } from "@prisma/client";

export interface SectionInput {
  type: SectionType;
  title: string;
  description: string;
  regionId: string;
  actionUrl: string;
  order: number;
  backgroundUrl: string;
  backgroundColor: string;
  buttonText?: string;
  buttonColor?: string;
  highlightProductIds?: number[];
}

type SectionFormProps = {
  initialData?: Partial<SectionInput>;
  regions: RegionItem[];
  availableProducts?: { id: number; name: string }[];
  onValuesChange: (values: SectionInput) => void;
};

const SectionForm: React.FC<SectionFormProps> = ({
  initialData = {
    type: SectionType.banner,
    title: "",
    description: "",
    regionId: "",
    actionUrl: "",
    order: 1,
    backgroundUrl: "",
    backgroundColor: "#063d79",
    highlightProductIds: [],
  },
  regions,
  availableProducts = [],
  onValuesChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  // Validación con Yup: se utiliza un multi-select para highlightProductIds
  const validationSchema = Yup.object().shape({
    type: Yup.mixed<SectionType>().oneOf(Object.values(SectionType)).required(),
    title: Yup.string().required("El título es requerido"),
    description: Yup.string().required("La descripción es requerida"),
    regionId: Yup.string().required("La región es requerida"),
    actionUrl: Yup.string().url("Debe ser una URL válida").notRequired(),
    order: Yup.number()
      .min(1, "El orden debe ser al menos 1")
      .required("El orden es requerido"),
    backgroundUrl: Yup.string().url("Debe ser una URL válida").notRequired(),
    backgroundColor: Yup.string().notRequired(),
    buttonText: Yup.string().notRequired(),
    buttonColor: Yup.string().notRequired(),
    highlightProductIds: Yup.array()
      .of(Yup.number())
      .when("type", {
        is: SectionType.highlight,
        then: Yup.array().min(
          1,
          "Debes seleccionar al menos un producto destacado"
        ),
        otherwise: Yup.array().notRequired(),
      }),
  });

  const FormObserver: React.FC<{
    onChange: (values: SectionInput) => void;
  }> = ({ onChange }) => {
    const { values } = useFormikContext<SectionInput>();
    useEffect(() => {
      onChange(values);
    }, [values, onChange]);
    return null;
  };

  const handlePreview = (url: string) => {
    if (url) {
      setIsLoading(true);
      setPreviewError(false);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setPreviewUrl(url);
        setIsLoading(false);
      };
      img.onerror = () => {
        setPreviewUrl(null);
        setIsLoading(false);
        setPreviewError(true);
      };
    } else {
      setPreviewUrl(null);
      setPreviewError(false);
    }
  };

  return (
    <div className="card shadow p-6 mb-6">
      <Formik
        initialValues={initialData as SectionInput}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Sección
              </label>
              <Field
                as="select"
                name="type"
                className="select select-bordered w-full"
              >
                <option value={SectionType.banner}>Banner</option>
                <option value={SectionType.highlight}>Destacados</option>
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <Field
                name="title"
                type="text"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="title"
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Texto del Botón
              </label>
              <Field
                name="buttonText"
                type="text"
                className="input input-bordered w-full"
                placeholder="Ej: Ir a la sección"
              />
              <ErrorMessage
                name="buttonText"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color del Botón
              </label>
              <Field
                name="buttonColor"
                type="text"
                className="input input-bordered w-full"
                placeholder="Ej: btn-primary"
              />
              <ErrorMessage
                name="buttonColor"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL de Acción (link)
              </label>
              <Field
                name="actionUrl"
                type="text"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="actionUrl"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Orden
              </label>
              <Field
                name="order"
                type="number"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="order"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color de Fondo
              </label>
              <Field
                name="backgroundColor"
                type="color"
                className="input input-bordered w-16"
              />
              <ErrorMessage
                name="backgroundColor"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {values.type === SectionType.highlight && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Productos Destacados
                </label>
                <Field
                  as="select"
                  name="highlightProductIds"
                  multiple
                  className="select select-bordered w-full"
                >
                  {availableProducts.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="highlightProductIds"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL de Fondo
              </label>
              <Field
                name="backgroundUrl"
                type="text"
                className="input input-bordered w-full"
                onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                  handlePreview(e.target.value)
                }
              />
              <ErrorMessage
                name="backgroundUrl"
                component="div"
                className="text-red-500 text-sm"
              />
              {isLoading && (
                <div className="mt-4 flex justify-center">
                  <Loader />
                </div>
              )}
              {!isLoading && previewError && (
                <div className="mt-4 text-sm text-red-500">
                  Vista previa no disponible.
                </div>
              )}
              {!isLoading && previewUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Vista previa:</p>
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    className="w-full h-40 object-cover border rounded"
                  />
                </div>
              )}
            </div>

            <FormObserver onChange={onValuesChange} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SectionForm;
