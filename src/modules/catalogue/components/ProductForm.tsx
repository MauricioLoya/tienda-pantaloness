'use client'

import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { deleteProductAction } from '../actions/deleteProductAction'
import { createProductAction } from '../actions/createProductAction'
import { updateProductAction } from '../actions/updateProductAction'
import GoBack from '@/lib/components/GoBack'
import { CategoryItem } from '../definitions'
// Tipos locales para manejar la parte visual de variantes
type LocalVariant = {
  size: string
  price: number
  stock: number
}

type FormValues = {
  name: string
  description: string
  basePrice: number
  active: boolean
}

export interface ProductFormProps {
  id?: number | string
  mode?: 'create' | 'update'
  initialData?: {
    name?: string
    description?: string
    basePrice?: number
    active?: boolean
    images?: { id?: number; url: string }[]
    categories?: CategoryItem[]
    variants?: { id?: number; size: string; price: number; stock: number }[]
  }
}

const ProductForm: React.FC<ProductFormProps> = ({
  id,
  mode = 'create',
  initialData = {}
}) => {
  const router = useRouter()

  const initialValues = {
    name: initialData.name || '',
    description: initialData.description || '',
    basePrice: initialData.basePrice || 0,
    active: initialData.active || false
  }

  const ProductSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string().required('La descripción es requerida'),
    basePrice: Yup.number()
      .min(0, 'El precio base debe ser mayor o igual a 0')
      .required('El precio base es requerido'),
    active: Yup.boolean()
  })

  const [images, setImages] = useState<string[]>(
    initialData.images ? initialData.images.map(img => img.url) : []
  )
  const [imageInput, setImageInput] = useState('')

  const [categories, setCategories] = useState<string[]>(
    initialData.categories
      ? initialData.categories.map(cat => cat.id.toString())
      : []
  )
  const [categoryInput, setCategoryInput] = useState('')

  const [variants, setVariants] = useState<LocalVariant[]>(
    initialData.variants
      ? initialData.variants.map(v => ({
          size: v.size,
          price: v.price,
          stock: v.stock
        }))
      : []
  )
  const [variantSize, setVariantSize] = useState('')
  const [variantPrice, setVariantPrice] = useState('')
  const [variantStock, setVariantStock] = useState('')

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setStatus }: FormikHelpers<FormValues>
  ) => {
    try {
      const imagesArray = images.map(url => ({ url }))
      const categoriesArray = categories
        .map(cat => parseInt(cat.trim(), 10))
        .filter(num => !isNaN(num))
        .map(num => ({ categoryId: num }))
      const variantsArray = variants.map(v => ({
        size: v.size,
        price: v.price,
        stock: v.stock
      }))

      const submissionData = {
        name: values.name,
        description: values.description,
        basePrice: values.basePrice,
        active: values.active,
        images: imagesArray,
        categories: categoriesArray,
        variants: variantsArray
      }

      let product
      if (mode === 'create') {
        product = await createProductAction(submissionData)
      } else {
        if (!id) throw new Error('ID no proporcionado')
        product = await updateProductAction(Number(id), submissionData)
      }

      if (product) {
        router.push(`/admin/catalogo/${product.id}`)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus(error.message || 'Error al procesar la solicitud')
      } else {
        console.log(error)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        if (!id) throw new Error('ID no proporcionado')
        const [isPending, startTransition] = React.useTransition()
        startTransition(async () => {
          await deleteProductAction(Number(id))
          router.push('/admin/catalogo')
        })
      } catch (error: any) {
        alert(error.message || 'Error al eliminar el producto')
      }
    }
  }

  const addVariant = () => {
    if (variantSize.trim() && variantPrice && variantStock) {
      setVariants([
        ...variants,
        {
          size: variantSize.trim(),
          price: parseFloat(variantPrice),
          stock: parseInt(variantStock, 10)
        }
      ])
      setVariantSize('')
      setVariantPrice('')
      setVariantStock('')
    }
  }

  return (
    <div className="p-2">
      <GoBack href="./" />
      <h1 className="text-2xl font-semibold text-gray-900 my-2">
        Editar Producto {initialData.name}
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status, handleSubmit: formikSubmit }) => (
          <Form className="grid grid-cols-2 gap-6" onSubmit={formikSubmit}>
            {/* Lado Izquierdo: Datos del producto */}
            <div className="flex flex-col gap-6">
              <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="card-title mb-4">
                  {mode === 'create' ? 'Crear Producto' : 'Editar Producto'}
                </h2>
                {status && <div className="alert alert-error">{status}</div>}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre</span>
                  </label>
                  <Field
                    name="name"
                    type="text"
                    className="input input-bordered"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-error"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Descripción</span>
                  </label>
                  <Field
                    name="description"
                    as="textarea"
                    className="textarea textarea-bordered"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-error"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Precio Base</span>
                  </label>
                  <Field
                    name="basePrice"
                    type="number"
                    className="input input-bordered"
                  />
                  <ErrorMessage
                    name="basePrice"
                    component="div"
                    className="text-error"
                  />
                </div>
                <div className="form-control flex items-center">
                  <label className="cursor-pointer label">
                    <span className="label-text">Activo</span>
                  </label>
                  <Field
                    name="active"
                    type="checkbox"
                    className="toggle toggle-accent"
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    {mode === 'create' ? 'Crear producto' : 'Guardar cambios'}
                  </button>
                  {mode === 'update' && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="btn btn-error"
                    >
                      Eliminar producto
                    </button>
                  )}
                </div>
              </div>
              {/* Sección de Variantes */}
              <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="card-title mb-4">Variantes</h2>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Tamaño"
                    value={variantSize}
                    onChange={e => setVariantSize(e.target.value)}
                    className="input input-bordered"
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={variantPrice}
                    onChange={e => setVariantPrice(e.target.value)}
                    className="input input-bordered"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={variantStock}
                    onChange={e => setVariantStock(e.target.value)}
                    className="input input-bordered"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addVariant}
                >
                  Agregar Variante
                </button>
                {variants.length > 0 && (
                  <div className="overflow-x-auto mt-4">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Tamaño</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Eliminar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((v, index) => (
                          <tr key={index}>
                            <td>{v.size}</td>
                            <td>{v.price}</td>
                            <td>{v.stock}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-xs btn-circle btn-error"
                                onClick={() =>
                                  setVariants(
                                    variants.filter((_, i) => i !== index)
                                  )
                                }
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Lado Derecho: Sección de Imágenes y Categorías */}
            <div className="flex flex-col gap-6">
              {/* Sección de Imágenes */}
              <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="card-title mb-4">Imágenes</h2>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">URL de la imagen</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageInput}
                      onChange={e => setImageInput(e.target.value)}
                      placeholder="https://..."
                      className="input input-bordered flex-1"
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        if (imageInput.trim()) {
                          setImages([...images, imageInput.trim()])
                          setImageInput('')
                        }
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
                {images.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <div className="flex space-x-2">
                      {images.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Imagen ${index}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setImages(images.filter((_, i) => i !== index))
                            }
                            className="absolute top-0 left-0 btn btn-xs btn-circle btn-error"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Sección de Categorías */}
              <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="card-title mb-4">Categorías</h2>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Agregar categoría (ID numérico)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={e => setCategoryInput(e.target.value)}
                      placeholder="ID de la categoría"
                      className="input input-bordered flex-1"
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        if (categoryInput.trim()) {
                          setCategories([...categories, categoryInput.trim()])
                          setCategoryInput('')
                        }
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
                {categories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {categories.map((cat, index) => (
                      <div key={index} className="badge badge-outline gap-2">
                        {cat}
                        <button
                          type="button"
                          className="btn btn-xs btn-circle btn-error"
                          onClick={() =>
                            setCategories(
                              categories.filter((_, i) => i !== index)
                            )
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ProductForm
