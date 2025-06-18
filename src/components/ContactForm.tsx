'use client';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
  const t = useTranslations('ContactForm');

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

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus({
        submitted: false,
        error: true,
        message: t('validation_error'),
      });
      return;
    }

    // Continue with form submission
    // Show success message
    setFormStatus({
      submitted: true,
      error: false,
      message: t('success_message'),
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
        <h2 className='card-title text-2xl mb-6'>{t('title')}</h2>

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
                <span className='label-text'>{t('full_name')}</span>
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder={t('name_placeholder')}
                className='input input-bordered w-full'
                required
              />
            </div>

            <div className='form-control mb-4'>
              <label className='label'>
                <span className='label-text'>{t('email')}</span>
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder={t('email_placeholder')}
                className='input input-bordered w-full'
                required
              />
            </div>

            <div className='form-control mb-4'>
              <label className='label'>
                <span className='label-text'>{t('subject')}</span>
              </label>
              <select
                className='select select-bordered w-full'
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value='' disabled>
                  {t('select_subject')}
                </option>
                <option value='info-productos'>{t('subjects.product_info')}</option>
                <option value='pedidos-entregas'>{t('subjects.orders_delivery')}</option>
                <option value='devoluciones'>{t('subjects.returns')}</option>
                <option value='atencion-cliente'>{t('subjects.customer_service')}</option>
                <option value='otros'>{t('subjects.other')}</option>
              </select>
            </div>

            <div className='form-control mb-6'>
              <label className='label'>
                <span className='label-text'>{t('message')}</span>
              </label>
              <textarea
                className='textarea textarea-bordered h-32'
                name='message'
                value={formData.message}
                onChange={handleChange}
                placeholder={t('message_placeholder')}
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
              {t('send_message')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactForm;