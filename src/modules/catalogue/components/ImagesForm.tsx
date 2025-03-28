"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addImageAction } from "../actions/addImageAction";
import { removeImageAction } from "../actions/removeImageAction";
import { useRouter } from "next/navigation";
import { ImageItem } from "../definitions";
import { FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useToast } from "@/lib/components/ToastContext";
import ImagePreview from "@/lib/components/ImagePreview";

interface ImagesFormProps {
  productId?: number;
  images?: ImageItem[];
}

interface ImageFormValues {
  url: string;
}

const ImageSchema = Yup.object().shape({
  url: Yup.string().url("URL inválida").required("La URL es requerida"),
});

const ImagesForm: React.FC<ImagesFormProps> = ({ productId, images = [] }) => {
  const router = useRouter();
  const { showToast } = useToast();

  async function handleSubmit(
    values: ImageFormValues,
    { resetForm }: { resetForm: () => void }
  ) {
    if (!productId) return;
    try {
      await addImageAction(productId, values.url.trim());
      resetForm();
      router.refresh();
      showToast("Imagen agregada correctamente", "success");
    } catch (error: any) {
      showToast(error.message || "Error al agregar la imagen", "error");
    }
  }

  async function handleRemove(imageId: number) {
    try {
      await removeImageAction(imageId);
      router.refresh();
      showToast("Imagen eliminada correctamente", "success");
    } catch (error: any) {
      showToast(error.message || "Error al eliminar la imagen", "error");
    }
  }

  return (
    <div className="card shadow p-4">
      <div className="grid gap-5">
        <h2 className="text-xl font-bold mb-2">Imágenes</h2>
        <Formik
          initialValues={{ url: "" }}
          validationSchema={ImageSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-2 mb-4">
              <div className="flex flex-col md:flex-row gap-2 items-start">
                <div className="flex-1">
                  <Field
                    type="text"
                    name="url"
                    placeholder="https://..."
                    className="input input-bordered w-full"
                  />
                  <ErrorMessage
                    name="url"
                    component="div"
                    className="text-error text-sm mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={isSubmitting || !productId}
                >
                  Agregar
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="flex flex-wrap gap-4">
          {images.map((img) => (
            <ImagePreview
              key={img.id}
              src={img.url}
              alt="Imagen"
              onRemove={() => handleRemove(img.id)}
              onPreview={() => window.open(img.url, "_blank")}
              containerClassName="relative w-32 h-32"
              imageClassName="w-full h-full object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagesForm;
