"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { saveSettingsAction } from "../actions/saveSettingsAction";
import { useToast } from '@/lib/components/ToastContext';
import { useRouter } from 'next/navigation';
import { RegionItem } from "@/modules/region/definitions";
import { SettingsFormValues, SocialLink } from "../definitions";
import BusinessHoursComponent from "./BusinessHours";

// Days of the week in Spanish
const daysOfWeek = [
  { id: "monday", label: "Lunes" },
  { id: "tuesday", label: "Martes" },
  { id: "wednesday", label: "Miércoles" },
  { id: "thursday", label: "Jueves" },
  { id: "friday", label: "Viernes" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

const validationSchema = Yup.object({
  storeName: Yup.string().required("El nombre de la tienda es obligatorio"),
  logoUrl: Yup.string()
    .url("Debe ser una URL válida")
    .required("El logo es obligatorio"),
  contactInfo: Yup.object({
    address: Yup.string().required("La dirección es obligatoria"),
    city: Yup.string().required("La ciudad es obligatoria"),
    zipCode: Yup.string().required("El código postal es obligatorio"),
    phone: Yup.string()
      .matches(/^\+?[0-9\s\-()]{8,15}$/, "Ingrese un número de teléfono válido")
      .required("El teléfono es obligatorio"),
    email: Yup.string().email("Debe ser un email válido").required("El email es obligatorio"),
    businessHours: Yup.array().of(
      Yup.object({
        day: Yup.string().required("El día es obligatorio"),
        isOpen: Yup.boolean(),
        openTime: Yup.string().when('isOpen', {
          is: true,
          then: schema => schema.required("La hora de apertura es obligatoria")
        }),
        closeTime: Yup.string().when('isOpen', {
          is: true,
          then: schema => schema.required("La hora de cierre es obligatoria")
        })
      })
    )
  }),
  freeShippingByRegion: Yup.array().required("Debes agregar al menos una región")
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
    .min(2, "Debes agregar todas las regiones"),
  socialLinks: Yup.array().of(
    Yup.object().shape({
      platform: Yup.string().required("La plataforma es obligatoria"),
      url: Yup.string().url("Debe ser una URL válida").required("La URL es obligatoria"),
    })
  )
});

// Default initial values to ensure all fields are controlled from the start
const defaultInitialValues = {
  storeName: "",
  logoUrl: "",
  contactInfo: {
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
    businessHours: daysOfWeek.map(day => ({
      day: day.id,
      isOpen: day.id !== "sunday", // Closed on Sundays by default
      openTime: "09:00",
      closeTime: "18:00"
    }))
  },
  freeShippingByRegion: [],
  socialLinks: [],
};

interface Props {
  regions: RegionItem[];
  initialValues: SettingsFormValues;
}

const StoreSettingsForm: React.FC<Props> = ({ initialValues, regions }) => {
  const { showToast } = useToast();
  const router = useRouter();

  // State to track which sections are open
  const [openSections, setOpenSections] = useState({
    generalInfo: true,
    contactInfo: true,
    businessHours: true,
    shippingConfig: true,
    socialLinks: true,
  });

  // Toggle section visibility
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const prepareInitialValues = () => {
    const prepared = {
      ...defaultInitialValues,
      ...initialValues
    };

    prepared.contactInfo = {
      ...defaultInitialValues.contactInfo,
      ...(initialValues.contactInfo || {})
    };

    if (!Array.isArray(prepared.contactInfo.businessHours) || prepared.contactInfo.businessHours.length === 0) {
      prepared.contactInfo.businessHours = daysOfWeek.map(day => ({
        day: day.id,
        isOpen: day.id !== "sunday",
        openTime: day.id === "saturday" ? "10:00" : "09:00",
        closeTime: day.id === "saturday" ? "14:00" : "18:00"
      }));
    }

    // Ensure freeShippingByRegion is always an array
    prepared.freeShippingByRegion = Array.isArray(initialValues.freeShippingByRegion)
      ? initialValues.freeShippingByRegion
      : [];

    return prepared;
  };

  const mergedInitialValues = prepareInitialValues();

  const handleSubmit = async (values: SettingsFormValues) => {
    try {
      // Make sure we send exactly the data structure expected by the server
      const dataToSave = {
        ...values,
        // Ensure we keep the businessHours array format for storage
        contactInfo: {
          ...values.contactInfo,
          // For businessHours, we already have the correct format
          businessHours: values.contactInfo.businessHours
        }
      };

      await saveSettingsAction(dataToSave);
      router.refresh();
      showToast('Configuraciones actualizadas correctamente', 'success');
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || 'Error al actualizar las configuraciones', 'error');
      } else {
        showToast('Error desconocido al actualizar la configuraciones', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <Formik
        initialValues={mergedInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize={true}
      >
        {({ values, errors, setFieldValue }) => (
          <Form className="space-y-8">
            {/* General Information - Collapsible Section */}
            <div className="collapse collapse-arrow bg-white rounded-lg shadow-sm border">
              <input
                type="checkbox"
                checked={openSections.generalInfo}
                onChange={() => toggleSection('generalInfo')}
                className="collapse-checkbox"
              />
              <div className="collapse-title text-xl font-semibold">
                Información General
              </div>
              <div className="collapse-content space-y-4">
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

            {/* Contact Information - Collapsible Section */}
            <div className="collapse collapse-arrow bg-white rounded-lg shadow-sm border">
              <input
                type="checkbox"
                checked={openSections.contactInfo}
                onChange={() => toggleSection('contactInfo')}
                className="collapse-checkbox"
              />
              <div className="collapse-title text-xl font-semibold">
                Información de Contacto
              </div>
              <div className="collapse-content space-y-4">
                <div>
                  <label className="block font-medium mb-1">Dirección</label>
                  <Field
                    name="contactInfo.address"
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Av. Principal 123, Colonia Centro"
                  />
                  <ErrorMessage
                    name="contactInfo.address"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Ciudad</label>
                    <Field
                      name="contactInfo.city"
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Ciudad de México"
                    />
                    <ErrorMessage
                      name="contactInfo.city"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Código Postal</label>
                    <Field
                      name="contactInfo.zipCode"
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="CP 12345"
                    />
                    <ErrorMessage
                      name="contactInfo.zipCode"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Teléfono</label>
                  <div className="relative">
                    <Field
                      name="contactInfo.phone"
                      type="tel"
                      className="input input-bordered w-full pl-10"
                      placeholder="+52 (55) 1234 5678"
                      maxLength={15}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Formato: +52 (55) 1234 5678</p>
                  <ErrorMessage
                    name="contactInfo.phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <div className="relative">
                    <Field
                      name="contactInfo.email"
                      type="email"
                      className="input input-bordered w-full pl-10"
                      placeholder="contacto@tiendapantalones.com"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                    </div>
                  </div>
                  <ErrorMessage
                    name="contactInfo.email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Business Hours - Collapsible Section */}
            <div className="collapse collapse-arrow bg-white rounded-lg shadow-sm border">
              <input
                type="checkbox"
                checked={openSections.businessHours}
                onChange={() => toggleSection('businessHours')}
                className="collapse-checkbox"
              />
              <div className="collapse-title text-xl font-semibold">
                Horarios de Atención
              </div>
              <div className="collapse-content">
                <BusinessHoursComponent
                  businessHours={values.contactInfo.businessHours || []}
                  setFieldValue={setFieldValue}
                />
              </div>
            </div>

            {/* Shipping Configuration - Collapsible Section */}
            <div className="collapse collapse-arrow bg-white rounded-lg shadow-sm border">
              <input
                type="checkbox"
                checked={openSections.shippingConfig}
                onChange={() => toggleSection('shippingConfig')}
                className="collapse-checkbox"
              />
              <div className="collapse-title text-xl font-semibold">
                Configuración de Envíos por Región
              </div>
              <div className="collapse-content">
                <FieldArray name="freeShippingByRegion">
                  {() => (
                    <div className="space-y-6 mt-4">
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
                {errors.freeShippingByRegion && typeof errors.freeShippingByRegion === 'string' && (
                  <div className="text-red-500 text-sm mt-4">{errors.freeShippingByRegion}</div>
                )}
              </div>
            </div>
            {/* Social Media Links - Collapsible Section */}
            <div className="collapse collapse-arrow bg-white rounded-lg shadow-sm border">
              <input
                type="checkbox"
                checked={openSections.socialLinks}
                onChange={() => toggleSection('socialLinks')}
                className="collapse-checkbox"
              />
              <div className="collapse-title text-xl font-semibold">
                Redes Sociales
              </div>
              <div className="collapse-content">
                <FieldArray name="socialLinks">
                  {({ push, remove }) => (
                    <div className="space-y-4 mt-4">
                      {values.socialLinks.length > 0 ? (
                        values.socialLinks.map((link, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 border rounded-md bg-gray-50">
                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-medium mb-1">Plataforma</label>
                                <Field
                                  name={`socialLinks.${index}.platform`}
                                  type="text"
                                  className="input input-bordered w-full"
                                  placeholder="Ej: Facebook, Instagram, TikTok"
                                />
                                <ErrorMessage
                                  name={`socialLinks.${index}.platform`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                              <div>
                                <label className="block font-medium mb-1">URL</label>
                                <Field
                                  name={`socialLinks.${index}.url`}
                                  type="text"
                                  className="input input-bordered w-full"
                                  placeholder="Ej: https://facebook.com/tienda"
                                />
                                <ErrorMessage
                                  name={`socialLinks.${index}.url`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="btn btn-square btn-error btn-outline"
                              title="Eliminar enlace"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No hay enlaces de redes sociales añadidos aún.</p>
                      )}
                      <button
                        type="button"
                        onClick={() => push({ platform: '', url: '' } as SocialLink)}
                        className="btn btn-outline btn-primary mt-4"
                      >
                        Añadir Red Social
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
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

export default StoreSettingsForm;