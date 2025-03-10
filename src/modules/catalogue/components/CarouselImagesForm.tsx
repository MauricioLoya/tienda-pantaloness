'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IoClose } from 'react-icons/io5'
import { FaEye } from 'react-icons/fa'
import { addImageAction } from '../actions/addImageAction'
import { removeImageAction } from '../actions/removeImageAction'
import { ImageItem } from "../definitions"

interface CarouselImagesFormProps {
  productId: number
  initialImages: ImageItem[]
}

const CarouselImagesForm: React.FC<CarouselImagesFormProps> = ({
  productId,
  initialImages,
}) => {
  const [images, setImages] = useState<ImageItem[]>(initialImages)
  const [imageInput, setImageInput] = useState('')
  const router = useRouter()

  async function handleAdd() {
    if (!imageInput.trim()) return
    // Se asume que addImageAction retorna un ImageItem (con id y url)
    const newImage: ImageItem = await addImageAction(productId, imageInput.trim())
    setImages([...images, newImage])
    setImageInput('')
    router.refresh()
  }

  async function handleRemove(image: ImageItem) {
    await removeImageAction(image.id)
    setImages(images.filter((img) => img.id !== image.id))
    router.refresh()
  }

  return (
    <div className="card shadow p-4">
      <h2 className="card-title mb-4">Imágenes</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="https://..."
          value={imageInput}
          onChange={(e) => setImageInput(e.target.value)}
        />
        <button type="button" className="btn btn-secondary" onClick={handleAdd}>
          Agregar
        </button>
      </div>
      {images.length > 0 ? (
        <>
          <div className="carousel w-full">
            {images.map((image, index) => {
              const slideId = `slide${index + 1}`
              const prevIndex = (index - 1 + images.length) % images.length
              const nextIndex = (index + 1) % images.length
              const prevSlideId = `slide${prevIndex + 1}`
              const nextSlideId = `slide${nextIndex + 1}`
              return (
                <div id={slideId} key={index} className="carousel-item relative w-full">
                  <img
                    src={image.url}
                    alt={`Imagen ${index}`}
                    className="w-full object-cover rounded-lg min-h-[150px] max-h-[300px]"
                  />
                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
                    <a href={`#${prevSlideId}`} className="btn btn-circle">❮</a>
                    <a href={`#${nextSlideId}`} className="btn btn-circle">❯</a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(image)}
                    className="absolute top-0 left-0 btn btn-xs btn-circle btn-error m-2"
                  >
                    <IoClose />
                  </button>
                  <button
                    type="button"
                    onClick={() => window.open(image.url, "_blank")}
                    className="absolute top-0 right-0 btn btn-xs btn-circle btn-info m-2"
                  >
                    <FaEye />
                  </button>
                </div>
              )
            })}
          </div>
          <div className="flex w-full justify-center gap-2 py-2">
            {images.map((_, index) => (
              <a key={index} href={`#slide${index + 1}`} className="btn btn-xs">
                {index + 1}
              </a>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No hay imágenes.</p>
      )}
    </div>
  )
}

export default CarouselImagesForm
