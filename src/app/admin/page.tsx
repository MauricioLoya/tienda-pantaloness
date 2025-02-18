'use client'
import React from 'react'
import { useForm } from 'react-hook-form'

const AdminLoginPage: React.FC = () => {
  const { register, handleSubmit, formState } = useForm()

  const onSubmit = handleSubmit(data => {
    console.log(data)
  })
  return (
    <>
      <h1>Admin Login Page</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
        <input
          {...register('email', {
            required: {
              value: true,
              message: 'El correo es requerido'
            }
          })}
          type="email"
          name="email"
          placeholder="Email"
        />
        {formState.errors.email && (
          <span className="text-red-500">
            {formState?.errors?.email?.message?.toString() ?? ''}
          </span>
        )}
        <input
          type="password"
          placeholder="Password"
          {...register('password', {
            required: {
              value: true,
              message: 'La contraseña es requerida'
            }
          })}
        />
        {formState.errors.password && (
          <span className="text-red-500">
            {formState?.errors?.password?.message?.toString() ?? ''}
          </span>
        )}
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default AdminLoginPage
