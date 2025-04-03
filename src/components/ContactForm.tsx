'use client';
import React, { useState } from 'react';

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus({
        submitted: false,
        error: true,
        message: 'Por favor completa todos los campos requeridos.',
      });
      return;
    }

    // Continue with form submission
    console.log('Form data submitted:', formData);

    // Show success message
    setFormStatus({
      submitted: true,
      error: false,
      message: '¡Gracias por contactarnos! Te responderemos a la brevedad.',
    });

    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className='card-body'>
        <h2 className='card-title text-2xl mb-6'>Envíanos un Mensaje</h2>

        {formStatus.submitted ? (
          <div className='alert alert-success mb-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='stroke-current shrink-0 h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span>{formStatus.message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className='form-control mb-4'>
              <label className='label'>
                <span className='label-text'>Nombre completo</span>
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Tu nombre'
                className='input input-bordered w-full'
                required
              />
            </div>

            <div className='form-control mb-4'>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='tucorreo@ejemplo.com'
                className='input input-bordered w-full'
                required
              />
            </div>

            <div className='form-control mb-4'>
              <label className='label'>
                <span className='label-text'>Asunto</span>
              </label>
              <select
                className='select select-bordered w-full'
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value='' disabled>
                  Selecciona un asunto
                </option>
                <option value='info-productos'>Información de productos</option>
                <option value='pedidos-entregas'>Pedidos y entregas</option>
                <option value='devoluciones'>Devoluciones</option>
                <option value='atencion-cliente'>Atención al cliente</option>
                <option value='otros'>Otros</option>
              </select>
            </div>

            <div className='form-control mb-6'>
              <label className='label'>
                <span className='label-text'>Mensaje</span>
              </label>
              <textarea
                className='textarea textarea-bordered h-32'
                name='message'
                value={formData.message}
                onChange={handleChange}
                placeholder='Escribe tu mensaje aquí...'
                required
              ></textarea>
            </div>

            {formStatus.error && (
              <div className='alert alert-error mb-6'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='stroke-current shrink-0 h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span>{formStatus.message}</span>
              </div>
            )}

            <button type='submit' className='btn btn-primary btn-block'>
              Enviar Mensaje
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
