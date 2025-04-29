'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import ForgotPasswordForm from '@/modules/token/components/ForgotPasswordForm';
import { generateRandomPassword } from '@/lib/utils';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

interface PasswordFormProps {
  userId: number;
  onSuccess: (userId: number, password: string) => Promise<void>;
  onClose: () => void;
  isAdmin?: boolean;
}

interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ResetPasswordValues {
  newPassword: string;
  confirmNewPassword: string;
}

// Componente para usuarios básicos
const UserPasswordForm: React.FC<{
  userId: number;
  onSuccess: (userId: number, password: string) => Promise<void>;
  onClose: () => void;
}> = ({ userId, onSuccess, onClose }) => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const changePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('La contraseña actual es requerida'),
    newPassword: Yup.string().required('La nueva contraseña es requerida'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Las contraseñas deben coincidir')
      .required('Confirma tu nueva contraseña'),
  });

  const handleTogglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
  };

  const handleToggleResetPassword = () => {
    setShowResetPassword(!showResetPassword);
  };

  const handleGeneratePassword = (setFieldValue: FormikHelpers<ChangePasswordValues>['setFieldValue']) => {
    const generatedPassword = generateRandomPassword();
    setFieldValue('newPassword', generatedPassword);
    setFieldValue('confirmNewPassword', generatedPassword);
  };

  const handlePasswordUpdate = async (values: ChangePasswordValues) => {
    try {
      await onSuccess(userId, values.newPassword);
      onClose();
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
    }
  };

  if (showResetPassword) {
    return <ForgotPasswordForm onClose={handleToggleResetPassword} />;
  }

  return (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }}
      validationSchema={changePasswordSchema}
      onSubmit={handlePasswordUpdate}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Cambiar contraseña</h3>

          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-gray-700">
              Contraseña actual:
            </label>
            <div className="relative">
              <Field
                type={showPasswords ? 'text' : 'password'}
                name="currentPassword"
                id="currentPassword"
                className={`input input-bordered w-full ${errors.currentPassword && touched.currentPassword ? 'input-error' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={handleTogglePasswordVisibility}
              >
                {showPasswords ? (
                  <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <HiOutlineEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <ErrorMessage name="currentPassword" component="div" className="text-error" />

            <button
              type="button"
              onClick={handleToggleResetPassword}
              className="text-blue-600 hover:text-blue-800 text-sm mt-1"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700">
              Nueva contraseña:
            </label>
            <div className="relative">
              <Field
                type={showPasswords ? 'text' : 'password'}
                name="newPassword"
                id="newPassword"
                className={`input input-bordered w-full ${errors.newPassword && touched.newPassword ? 'input-error' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={handleTogglePasswordVisibility}
              >
                {showPasswords ? (
                  <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <HiOutlineEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <ErrorMessage name="newPassword" component="div" className="text-error" />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmNewPassword" className="block text-gray-700">
              Confirmar nueva contraseña:
            </label>
            <div className="relative">
              <Field
                type={showPasswords ? 'text' : 'password'}
                name="confirmNewPassword"
                id="confirmNewPassword"
                className={`input input-bordered w-full ${errors.confirmNewPassword && touched.confirmNewPassword ? 'input-error' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={handleTogglePasswordVisibility}
              >
                {showPasswords ? (
                  <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <HiOutlineEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <ErrorMessage name="confirmNewPassword" component="div" className="text-error" />
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => handleGeneratePassword(setFieldValue)}
              className="btn btn-sm btn-outline"
            >
              Generar contraseña
            </button>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Cambiar contraseña
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// Componente para administradores
const AdminPasswordForm: React.FC<{
  userId: number;
  onSuccess: (userId: number, password: string) => Promise<void>;
  onClose: () => void;
}> = ({ userId, onSuccess, onClose }) => {
  const [showPasswords, setShowPasswords] = useState(false);

  const resetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required('La nueva contraseña es requerida'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Las contraseñas deben coincidir')
      .required('Confirma tu nueva contraseña'),
  });

  const handleTogglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
  };

  const handleGeneratePassword = (setFieldValue: FormikHelpers<ResetPasswordValues>['setFieldValue']) => {
    const generatedPassword = generateRandomPassword();
    setFieldValue('newPassword', generatedPassword);
    setFieldValue('confirmNewPassword', generatedPassword);
  };

  const handlePasswordUpdate = async (values: ResetPasswordValues) => {
    try {
      await onSuccess(userId, values.newPassword);
      onClose();
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
    }
  };

  return (
    <Formik
      initialValues={{
        newPassword: '',
        confirmNewPassword: ''
      }}
      validationSchema={resetPasswordSchema}
      onSubmit={handlePasswordUpdate}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Restablecer contraseña (Admin)</h3>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700">
              Nueva contraseña:
            </label>
            <div className="relative">
              <Field
                type={showPasswords ? 'text' : 'password'}
                name="newPassword"
                id="newPassword"
                className={`input input-bordered w-full ${errors.newPassword && touched.newPassword ? 'input-error' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={handleTogglePasswordVisibility}
              >
                {showPasswords ? (
                  <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <HiOutlineEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <ErrorMessage name="newPassword" component="div" className="text-error" />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmNewPassword" className="block text-gray-700">
              Confirmar nueva contraseña:
            </label>
            <div className="relative">
              <Field
                type={showPasswords ? 'text' : 'password'}
                name="confirmNewPassword"
                id="confirmNewPassword"
                className={`input input-bordered w-full ${errors.confirmNewPassword && touched.confirmNewPassword ? 'input-error' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={handleTogglePasswordVisibility}
              >
                {showPasswords ? (
                  <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <HiOutlineEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <ErrorMessage name="confirmNewPassword" component="div" className="text-error" />
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => handleGeneratePassword(setFieldValue)}
              className="btn btn-sm btn-outline"
            >
              Generar contraseña
            </button>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Restablecer contraseña
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const PasswordForm: React.FC<PasswordFormProps> = ({
  userId,
  onSuccess,
  onClose,
  isAdmin = false
}) => {
  if (isAdmin) {
    return <AdminPasswordForm userId={userId} onSuccess={onSuccess} onClose={onClose} />;
  } else {
    return <UserPasswordForm userId={userId} onSuccess={onSuccess} onClose={onClose} />;
  }
};

export default PasswordForm;